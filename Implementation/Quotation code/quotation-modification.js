// Client Script for Quotation - ERPNext v15 Compatible with Debug Logging
frappe.ui.form.on('Quotation', {
    refresh: function(frm) {
        console.log('🔄 Quotation refresh triggered', {
            docname: frm.doc.name,
            docstatus: frm.doc.docstatus,
            company: frm.doc.company,
            items_count: frm.doc.items ? frm.doc.items.length : 0
        });
        
        // Add custom button to fetch BOM details
        if (frm.doc.docstatus < 1) {
            frm.add_custom_button(__('Fetch BOM Details'), function() {
                console.log('🔧 Fetch BOM Details button clicked');
                fetch_bom_details(frm);
            }, __('Tools'));
            
            // Add button to expand all BOMs
            frm.add_custom_button(__('Expand All BOMs'), function() {
                console.log('🔧 Expand All BOMs button clicked');
                expand_all_boms(frm);
            }, __('Tools'));
        }
        
        // Add button to create project from quotation
        if (frm.doc.docstatus === 1) {
            frm.add_custom_button(__('Create Project'), function() {
                console.log('🔧 Create Project button clicked');
                create_project_from_quotation(frm);
            }, __('Create'));
        }
    },
    
    onload_post_render: function(frm) {
        console.log('🚀 Quotation onload_post_render', {
            is_new: frm.is_new(),
            docname: frm.doc.name
        });
        
        // Set default values for construction quotations
        if (frm.is_new()) {
            console.log('📝 Setting default construction values for new quotation');
            set_default_construction_values(frm);
        }
    },
    
    company: function(frm) {
        console.log('🏢 Company changed', {
            old_company: frm._prev_company,
            new_company: frm.doc.company
        });
        
        // Refresh company-dependent data when company changes
        if (frm.doc.company) {
            frm.events.refresh(frm);
        }
        frm._prev_company = frm.doc.company;
    }
});

frappe.ui.form.on('Quotation Item', {
    item_code: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        console.log('📦 Item code changed', {
            item_code: row.item_code,
            row_name: row.name,
            company: frm.doc.company,
            existing_bom: row.bom
        });
        
        if (row.item_code && frm.doc.company) {
            console.log('🔍 Searching for active BOM for item:', row.item_code);
            
            // Auto-fetch active BOM for the item
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'BOM',
                    fields: ['name', 'item'],
                    filters: {
                        'item': row.item_code,
                        'is_active': 1,
                        'is_default': 1,
                        'company': frm.doc.company
                    },
                    limit: 1
                },
                callback: function(r) {
                    console.log('📋 BOM search result', {
                        item_code: row.item_code,
                        found_boms: r.message ? r.message.length : 0,
                        bom_data: r.message
                    });
                    
                    if (r.message && r.message.length > 0) {
                        console.log('✅ Setting BOM for item', {
                            item_code: row.item_code,
                            bom: r.message[0].name
                        });
                        frappe.model.set_value(cdt, cdn, 'bom', r.message[0].name);
                        frm.refresh_field('items');
                    } else {
                        console.log('❌ No active BOM found for item:', row.item_code);
                    }
                },
                error: function(err) {
                    console.error('💥 Error fetching BOM:', err);
                }
            });
        } else {
            if (!row.item_code) {
                console.log('⚠️ No item code provided');
            }
            if (!frm.doc.company) {
                console.log('⚠️ No company selected');
            }
        }
    },
    
    qty: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        console.log('🔢 Quantity changed', {
            item_code: row.item_code,
            new_qty: row.qty,
            has_bom: !!row.bom
        });
        
        // Update BOM quantities when main item quantity changes
        if (row.bom && row.qty) {
            console.log('🔄 Updating BOM quantities for changed qty');
            update_bom_quantities(frm, row, cdt, cdn);
        }
    }
});

function fetch_bom_details(frm) {
    console.log('🔍 Starting BOM details fetch', {
        company: frm.doc.company,
        total_items: frm.doc.items ? frm.doc.items.length : 0
    });
    
    if (!frm.doc.company) {
        console.error('❌ No company selected');
        frappe.msgprint(__('Please select a company first.'));
        return;
    }
    
    let has_bom_items = false;
    let processed_items = 0;
    
    $.each(frm.doc.items, function(i, item) {
        console.log(`📦 Processing item ${i + 1}/${frm.doc.items.length}`, {
            item_code: item.item_code,
            bom: item.bom,
            qty: item.qty,
            is_bom_item: item.is_bom_item
        });
        
        if (item.item_code && item.bom) {
            has_bom_items = true;
            console.log(`🔄 Fetching BOM details for: ${item.item_code}`);
            
            frappe.call({
                method: 'erpnext.manufacturing.doctype.bom.bom.get_bom_items',
                args: {
                    bom: item.bom,
                    company: frm.doc.company,
                    qty: item.qty || 1,
                    fetch_exploded: 1
                },
                callback: function(r) {
                    processed_items++;
                    console.log(`✅ BOM details received for ${item.item_code}`, {
                        bom: item.bom,
                        bom_items_count: r.message ? r.message.length : 0,
                        processed: processed_items,
                        bom_items: r.message
                    });
                    
                    if (r.message) {
                        add_bom_items_to_quotation(frm, r.message, i);
                    } else {
                        console.log(`⚠️ No BOM items found for ${item.item_code}`);
                    }
                },
                error: function(err) {
                    processed_items++;
                    console.error(`💥 Error fetching BOM for ${item.item_code}:`, err);
                }
            });
        } else {
            if (!item.item_code) {
                console.log(`⚠️ Item ${i + 1} has no item_code`);
            }
            if (!item.bom) {
                console.log(`⚠️ Item ${i + 1} (${item.item_code}) has no BOM`);
            }
        }
    });
    
    if (!has_bom_items) {
        console.log('❌ No items with BOMs found');
        frappe.msgprint(__('No items with BOMs found. Please add items that have BOMs first.'));
    } else {
        console.log(`🚀 Started processing ${frm.doc.items.filter(item => item.item_code && item.bom).length} items with BOMs`);
    }
}

function expand_all_boms(frm) {
    if (!frm.doc.company) {
        frappe.msgprint(__('Please select a company first.'));
        return;
    }
    
    frappe.confirm(
        __('This will replace all items with their BOM components. Continue?'),
        function() {
            let promises = [];
            let main_items = [];
            
            // Collect all main items with BOMs
            $.each(frm.doc.items, function(i, item) {
                if (item.item_code && item.bom && !item.is_bom_item) {
                    main_items.push({
                        index: i,
                        item: item
                    });
                }
            });
            
            // Create promises for all BOM fetches
            main_items.forEach(function(main_item) {
                let promise = new Promise(function(resolve, reject) {
                    frappe.call({
                        method: 'erpnext.manufacturing.doctype.bom.bom.get_bom_items',
                        args: {
                            bom: main_item.item.bom,
                            company: frm.doc.company,
                            qty: main_item.item.qty || 1,
                            fetch_exploded: 1
                        },
                        callback: function(r) {
                            if (r.message) {
                                resolve({
                                    bom_items: r.message,
                                    main_index: main_item.index,
                                    main_item: main_item.item
                                });
                            } else {
                                reject();
                            }
                        }
                    });
                });
                promises.push(promise);
            });
            
            // Process all responses
            Promise.all(promises).then(function(results) {
                // Clear all items
                frm.clear_table('items');
                
                // Add expanded items
                results.forEach(function(result) {
                    // Add main item as header
                    let header = frm.add_child('items');
                    header.item_code = result.main_item.item_code;
                    header.item_name = result.main_item.item_name;
                    header.description = result.main_item.description || result.main_item.item_name;
                    header.qty = result.main_item.qty || 1;
                    header.uom = result.main_item.uom;
                    header.rate = 0; // Header item with zero rate
                    header.is_main_item = 1;
                    
                    // Add BOM items
                    result.bom_items.forEach(function(bom_item) {
                        let child = frm.add_child('items');
                        child.item_code = bom_item.item_code;
                        child.item_name = bom_item.item_name;
                        child.description = bom_item.description || bom_item.item_name;
                        child.qty = bom_item.qty;
                        child.uom = bom_item.uom;
                        child.rate = bom_item.rate || 0;
                        child.is_bom_item = 1;
                        child.parent_bom = result.main_item.bom;
                    });
                });
                
                frm.refresh_field('items');
                frm.trigger('calculate_total');
                
                frappe.msgprint(__('All BOMs have been expanded successfully.'));
            }).catch(function() {
                frappe.msgprint(__('Error occurred while expanding BOMs.'));
            });
        }
    );
}

function add_bom_items_to_quotation(frm, bom_items, main_item_idx) {
    console.log('➕ Adding BOM items to quotation', {
        main_item_idx: main_item_idx,
        bom_items_count: bom_items.length,
        main_item: frm.doc.items[main_item_idx].item_code,
        bom_items: bom_items.map(item => ({
            item_code: item.item_code,
            qty: item.qty,
            rate: item.rate
        }))
    });
    
    // Add BOM items after the main item
    let insert_index = main_item_idx + 1;
    
    // Remove existing BOM items for this main item
    let items_to_remove = [];
    for (let i = insert_index; i < frm.doc.items.length; i++) {
        if (frm.doc.items[i].is_bom_item) {
            items_to_remove.push(i);
            console.log(`🗑️ Marking item for removal: ${frm.doc.items[i].item_code} at index ${i}`);
        } else {
            break; // Stop at next main item
        }
    }
    
    console.log(`🗑️ Removing ${items_to_remove.length} existing BOM items`);
    
    // Remove from bottom to top to maintain indices
    for (let i = items_to_remove.length - 1; i >= 0; i--) {
        frm.get_field('items').grid.grid_rows[items_to_remove[i]].remove();
    }
    
    // Add new BOM items
    bom_items.forEach(function(bom_item, index) {
        console.log(`➕ Adding BOM item ${index + 1}/${bom_items.length}`, {
            item_code: bom_item.item_code,
            qty: bom_item.qty,
            rate: bom_item.rate,
            insert_at: insert_index + index
        });
        
        let child = frm.add_child('items', null, insert_index + index);
        child.item_code = bom_item.item_code;
        child.item_name = bom_item.item_name;
        child.description = bom_item.description || bom_item.item_name;
        child.qty = bom_item.qty;
        child.uom = bom_item.uom;
        child.rate = bom_item.rate || 0;
        child.is_bom_item = 1;
        child.parent_item_code = frm.doc.items[main_item_idx].item_code;
    });
    
    console.log('✅ BOM items added successfully. Refreshing form...');
    frm.refresh_field('items');
    frm.trigger('calculate_total');
}

function update_bom_quantities(frm, main_item, cdt, cdn) {
    // Update quantities of related BOM items when main item quantity changes
    let main_item_idx = frm.doc.items.findIndex(item => item.name === main_item.name);
    
    if (main_item_idx !== -1) {
        frappe.call({
            method: 'erpnext.manufacturing.doctype.bom.bom.get_bom_items',
            args: {
                bom: main_item.bom,
                company: frm.doc.company,
                qty: main_item.qty || 1,
                fetch_exploded: 1
            },
            callback: function(r) {
                if (r.message) {
                    // Update existing BOM items
                    for (let i = main_item_idx + 1; i < frm.doc.items.length; i++) {
                        let current_item = frm.doc.items[i];
                        if (current_item.is_bom_item && current_item.parent_item_code === main_item.item_code) {
                            let bom_item = r.message.find(bi => bi.item_code === current_item.item_code);
                            if (bom_item) {
                                frappe.model.set_value(current_item.doctype, current_item.name, 'qty', bom_item.qty);
                            }
                        } else if (!current_item.is_bom_item) {
                            break; // Stop at next main item
                        }
                    }
                    frm.refresh_field('items');
                }
            }
        });
    }
}

function set_default_construction_values(frm) {
    console.log('🎯 Setting default construction values', {
        has_payment_terms: !!frm.doc.payment_terms_custom,
        has_bank_details: !!frm.doc.bank_details,
        has_scope_of_work: !!frm.doc.scope_of_work
    });
    
    // Set default payment terms
    if (!frm.doc.payment_terms_custom) {
        console.log('💳 Setting default payment terms');
        let default_payment_terms = `
        <div style="margin: 10px 0;">
            <h4 style="margin-bottom: 10px;">Payment Terms:</h4>
            <ul style="margin-left: 20px;">
                <li>25% advance payment upon order confirmation</li>
                <li>50% payment during fabrication progress</li>
                <li>25% final payment upon completion and installation</li>
            </ul>
        </div>
        `;
        frm.set_value('payment_terms_custom', default_payment_terms);
    }
    
    // Set default bank details template
    if (!frm.doc.bank_details) {
        console.log('🏦 Setting default bank details template');
        let default_bank_details = `
        <div style="margin: 10px 0;">
            <h4 style="margin-bottom: 10px;">Bank Details:</h4>
            <p>Account Name: [Your Company Name]<br>
            Account Number: [Account Number]<br>
            Bank: [Bank Name]<br>
            Branch: [Branch Name]<br>
            IFSC Code: [IFSC Code]</p>
        </div>
        `;
        frm.set_value('bank_details', default_bank_details);
    }
    
    // Set default scope of work template
    if (!frm.doc.scope_of_work) {
        console.log('📋 Setting default scope of work template');
        let default_scope = `
        <div style="margin: 10px 0;">
            <h4>Scope of Work includes:</h4>
            <ul style="margin-left: 20px;">
                <li>Design and fabrication as per specifications</li>
                <li>Supply of all materials</li>
                <li>Installation and commissioning</li>
                <li>Testing and handover</li>
            </ul>
        </div>
        `;
        frm.set_value('scope_of_work', default_scope);
    }
    
    console.log('✅ Default construction values set successfully');
}

function create_project_from_quotation(frm) {
    console.log('🚀 Creating project from quotation', {
        quotation: frm.doc.name,
        customer: frm.doc.customer,
        grand_total: frm.doc.grand_total
    });
    
    frappe.prompt([
        {
            'fieldname': 'project_name',
            'fieldtype': 'Data',
            'label': 'Project Name',
            'reqd': 1,
            'default': frm.doc.project_name || `${frm.doc.customer} - ${frm.doc.title}`
        },
        {
            'fieldname': 'expected_start_date',
            'fieldtype': 'Date',
            'label': 'Expected Start Date',
            'reqd': 1,
            'default': frappe.datetime.add_days(frm.doc.transaction_date, 1)
        },
        {
            'fieldname': 'expected_end_date',
            'fieldtype': 'Date',
            'label': 'Expected End Date',
            'reqd': 1,
            'default': frappe.datetime.add_days(frm.doc.transaction_date, 30)
        }
    ], function(values) {
        console.log('📝 Project creation values received', values);
        
        frappe.call({
            method: 'frappe.client.insert',
            args: {
                doc: {
                    doctype: 'Project',
                    project_name: values.project_name,
                    customer: frm.doc.customer,
                    project_type: 'External',
                    expected_start_date: values.expected_start_date,
                    expected_end_date: values.expected_end_date,
                    estimated_costing: frm.doc.grand_total,
                    company: frm.doc.company,
                    notes: frm.doc.scope_of_work || 'Project created from Quotation: ' + frm.doc.name
                }
            },
            callback: function(r) {
                console.log('✅ Project creation response', r);
                
                if (r.message) {
                    console.log('🔗 Linking quotation to project');
                    // Link the quotation to the project
                    frappe.call({
                        method: 'frappe.client.set_value',
                        args: {
                            doctype: 'Quotation',
                            name: frm.doc.name,
                            fieldname: 'project',
                            value: r.message.name
                        },
                        callback: function(link_response) {
                            console.log('🔗 Project link response', link_response);
                        }
                    });
                    
                    frappe.msgprint({
                        title: __('Project Created'),
                        message: __('Project {0} has been created successfully.', 
                            [`<a href="/app/project/${r.message.name}" target="_blank">${r.message.name}</a>`]),
                        indicator: 'green'
                    });
                    
                    console.log('🔄 Reloading document after project creation');
                    frm.reload_doc();
                }
            },
            error: function(err) {
                console.error('💥 Error creating project:', err);
            }
        });
    }, __('Create Project'), __('Create'));
}