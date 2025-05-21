// Client Script for Quotation with Separate BOM Items Table - ERPNext v15

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
            
            // Add button to expand BOMs to separate table
            frm.add_custom_button(__('Expand BOMs to Table'), function() {
                console.log('🔧 Expand BOMs to Table button clicked');
                expand_boms_to_table(frm);
            }, __('Tools'));
            
            // Add button to sync BOM quantities
            frm.add_custom_button(__('Sync BOM Quantities'), function() {
                console.log('🔧 Sync BOM Quantities button clicked');
                sync_bom_quantities(frm);
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
    },
    
    validate: function(frm) {
        console.log('🔍 Validating quotation', {
            docname: frm.doc.name,
            items_count: frm.doc.items ? frm.doc.items.length : 0,
            bom_items_count: frm.doc.custom_bom_items ? frm.doc.custom_bom_items.length : 0
        });
        
        // Calculate totals for BOM items
        calculate_bom_totals(frm);
        update_main_item_prices_from_bom(frm);
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
                    fields: ['name', 'item', 'total_cost'],
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
                        
                        // Set the rate from BOM total cost if available
                        if (r.message[0].total_cost) {
                            frappe.model.set_value(cdt, cdn, 'rate', r.message[0].total_cost);
                            frappe.model.set_value(cdt, cdn, 'amount', (row.qty || 1) * r.message[0].total_cost);
                        }
                        
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
            update_bom_quantities(frm, row);
        }
        
        // Update amount for the main item
        if (row.rate && row.qty) {
            frappe.model.set_value(cdt, cdn, 'amount', row.qty * row.rate);
        }
    },
    
    bom: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        console.log('🔄 BOM changed', {
            item_code: row.item_code,
            new_bom: row.bom
        });
        
        // Suggest expanding BOM when BOM is selected
        if (row.bom) {
            show_bom_expand_suggestion(frm);
            
            // Get BOM total cost and update the main item rate
            frappe.call({
                method: 'frappe.client.get_value',
                args: {
                    doctype: 'BOM',
                    fieldname: 'total_cost',
                    filters: { name: row.bom }
                },
                callback: function(r) {
                    if (r.message && r.message.total_cost) {
                        frappe.model.set_value(cdt, cdn, 'rate', r.message.total_cost);
                        frappe.model.set_value(cdt, cdn, 'amount', (row.qty || 1) * r.message.total_cost);
                    }
                }
            });
        }
    }
});

// Functions for managing BOM items in separate table
function expand_boms_to_table(frm) {
    console.log('🔄 Starting expansion of BOMs to separate table');
    
    if (!frm.doc.company) {
        frappe.msgprint(__('Please select a company first.'));
        return;
    }
    
    // Clear existing BOM items
    frm.clear_table('custom_bom_items');
    
    let promises = [];
    let items_with_bom = frm.doc.items.filter(item => item.item_code && item.bom);
    
    if (items_with_bom.length === 0) {
        frappe.msgprint(__('No items with BOMs found in the quotation.'));
        return;
    }
    
    // Show progress indicator
    frappe.show_progress('Expanding BOMs', 0, items_with_bom.length);
    
    // Process each item with BOM
    items_with_bom.forEach(function(item, index) {
        let promise = new Promise(function(resolve) {
            frappe.call({
                method: 'erpnext.manufacturing.doctype.bom.bom.get_bom_items',
                args: {
                    bom: item.bom,
                    company: frm.doc.company,
                    qty: item.qty || 1,
                    fetch_exploded: 1,
                    fetch_scrap_items: 1
                },
                callback: function(r) {
                    frappe.show_progress('Expanding BOMs', index + 1, items_with_bom.length);
                    
                    if (r.message) {
                        // Add BOM items to separate table
                        r.message.forEach(function(bom_item) {
                            let child = frm.add_child('custom_bom_items');
                            child.parent_item = item.item_code;
                            child.item_code = bom_item.item_code;
                            child.item_name = bom_item.item_name;
                            child.description = bom_item.description || bom_item.item_name;
                            child.quantity = bom_item.qty;
                            child.uom = bom_item.uom;
                            child.rate = bom_item.rate || 0;
                            child.amount = bom_item.qty * (bom_item.rate || 0);
                            child.bom_no = item.bom;
                            child.parent_quotation_item = item.name;
                        });
                    }
                    resolve();
                }
            });
        });
        promises.push(promise);
    });
    
    // When all BOMs are processed
    Promise.all(promises).then(function() {
        frm.refresh_field('custom_bom_items');
        calculate_bom_totals(frm);
        update_main_item_prices_from_bom(frm);
        frappe.msgprint(__('BOMs expanded to separate table successfully.'));
    });
}

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
    
    // Clear existing BOM items
    frm.clear_table('custom_bom_items');
    
    let has_bom_items = false;
    let processed_items = 0;
    let total_items_with_bom = frm.doc.items.filter(item => item.item_code && item.bom).length;
    
    // Show progress indicator
    frappe.show_progress('Fetching BOM Details', 0, total_items_with_bom);
    
    $.each(frm.doc.items, function(i, item) {
        console.log(`📦 Processing item ${i + 1}/${frm.doc.items.length}`, {
            item_code: item.item_code,
            bom: item.bom,
            qty: item.qty
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
                    fetch_exploded: 1,
                    fetch_scrap_items: 1
                },
                callback: function(r) {
                    processed_items++;
                    frappe.show_progress('Fetching BOM Details', processed_items, total_items_with_bom);
                    
                    console.log(`✅ BOM details received for ${item.item_code}`, {
                        bom: item.bom,
                        bom_items_count: r.message ? r.message.length : 0,
                        processed: processed_items,
                        bom_items: r.message
                    });
                    
                    if (r.message) {
                        // Add BOM items to custom table
                        r.message.forEach(function(bom_item) {
                            let child = frm.add_child('custom_bom_items');
                            child.parent_item = item.item_code;
                            child.item_code = bom_item.item_code;
                            child.item_name = bom_item.item_name;
                            child.description = bom_item.description || bom_item.item_name;
                            child.quantity = bom_item.qty;
                            child.uom = bom_item.uom;
                            child.rate = bom_item.rate || 0;
                            child.amount = bom_item.qty * (bom_item.rate || 0);
                            child.bom_no = item.bom;
                            child.parent_quotation_item = item.name;
                        });
                        
                        // Refresh the field after adding all items for this BOM
                        frm.refresh_field('custom_bom_items');
                    } else {
                        console.log(`⚠️ No BOM items found for ${item.item_code}`);
                    }
                    
                    // If all items are processed, show completion message
                    if (processed_items === total_items_with_bom) {
                        calculate_bom_totals(frm);
                        update_main_item_prices_from_bom(frm);
                        frappe.msgprint(__('BOM details fetched and added to BOM Items table.'));
                    }
                },
                error: function(err) {
                    processed_items++;
                    frappe.show_progress('Fetching BOM Details', processed_items, total_items_with_bom);
                    console.error(`💥 Error fetching BOM for ${item.item_code}:`, err);
                }
            });
        }
    });
    
    if (!has_bom_items) {
        console.log('❌ No items with BOMs found');
        frappe.msgprint(__('No items with BOMs found. Please add items that have BOMs first.'));
    } else {
        console.log(`🚀 Started processing ${total_items_with_bom} items with BOMs`);
    }
}

function update_bom_quantities(frm, main_item) {
    console.log('🔢 Updating BOM quantities for item', {
        item_code: main_item.item_code,
        qty: main_item.qty
    });
    
    // Update quantities in BOM items table
    if (frm.doc.custom_bom_items && frm.doc.custom_bom_items.length > 0) {
        // Show progress indicator
        frappe.show_progress('Updating BOM Quantities', 0, 1);
        
        frappe.call({
            method: 'erpnext.manufacturing.doctype.bom.bom.get_bom_items',
            args: {
                bom: main_item.bom,
                company: frm.doc.company,
                qty: main_item.qty || 1,
                fetch_exploded: 1,
                fetch_scrap_items: 1
            },
            callback: function(r) {
                if (r.message) {
                    let bom_items_map = {};
                    
                    // Create a map of item_code to qty for quick lookup
                    r.message.forEach(function(item) {
                        bom_items_map[item.item_code] = {
                            qty: item.qty,
                            rate: item.rate || 0
                        };
                    });
                    
                    // Update quantities in the custom BOM items table
                    frm.doc.custom_bom_items.forEach(function(bom_item) {
                        if (bom_item.parent_quotation_item === main_item.name) {
                            if (bom_items_map[bom_item.item_code]) {
                                let updated_qty = bom_items_map[bom_item.item_code].qty;
                                let updated_rate = bom_items_map[bom_item.item_code].rate;
                                frappe.model.set_value(bom_item.doctype, bom_item.name, 'quantity', updated_qty);
                                frappe.model.set_value(bom_item.doctype, bom_item.name, 'rate', updated_rate);
                                frappe.model.set_value(bom_item.doctype, bom_item.name, 'amount', 
                                    updated_qty * updated_rate);
                            }
                        }
                    });
                    
                    frappe.show_progress('Updating BOM Quantities', 1, 1);
                    frm.refresh_field('custom_bom_items');
                    calculate_bom_totals(frm);
                    update_main_item_prices_from_bom(frm);
                }
            }
        });
    }
}

function sync_bom_quantities(frm) {
    console.log('🔄 Syncing BOM quantities');
    
    // Get all main items with BOMs
    let main_items = frm.doc.items.filter(item => item.bom);
    
    if (main_items.length === 0) {
        frappe.msgprint(__('No items with BOMs found.'));
        return;
    }
    
    // Show progress indicator
    frappe.show_progress('Syncing BOM Quantities', 0, main_items.length);
    
    // Clear and rebuild the BOM items table
    frm.clear_table('custom_bom_items');
    
    let processed_items = 0;
    
    // Update each main item's BOM components
    main_items.forEach(function(item, index) {
        frappe.call({
            method: 'erpnext.manufacturing.doctype.bom.bom.get_bom_items',
            args: {
                bom: item.bom,
                company: frm.doc.company,
                qty: item.qty || 1,
                fetch_exploded: 1,
                fetch_scrap_items: 1
            },
            callback: function(r) {
                processed_items++;
                frappe.show_progress('Syncing BOM Quantities', processed_items, main_items.length);
                
                if (r.message) {
                    // Add updated BOM items to the custom table
                    r.message.forEach(function(bom_item) {
                        let child = frm.add_child('custom_bom_items');
                        child.parent_item = item.item_code;
                        child.item_code = bom_item.item_code;
                        child.item_name = bom_item.item_name;
                        child.description = bom_item.description || bom_item.item_name;
                        child.quantity = bom_item.qty;
                        child.uom = bom_item.uom;
                        child.rate = bom_item.rate || 0;
                        child.amount = bom_item.qty * (bom_item.rate || 0);
                        child.bom_no = item.bom;
                        child.parent_quotation_item = item.name;
                    });
                    
                    frm.refresh_field('custom_bom_items');
                }
                
                // If all items are processed, show completion message
                if (processed_items === main_items.length) {
                    calculate_bom_totals(frm);
                    update_main_item_prices_from_bom(frm);
                    frappe.msgprint(__('BOM quantities synced successfully.'));
                }
            }
        });
    });
}

function calculate_bom_totals(frm) {
    console.log('🧮 Calculating BOM totals');
    
    if (!frm.doc.custom_bom_items || frm.doc.custom_bom_items.length === 0) {
        return;
    }
    
    // Calculate amount for each BOM item
    let total_amount = 0;
    
    frm.doc.custom_bom_items.forEach(function(item) {
        item.amount = item.quantity * item.rate;
        total_amount += item.amount;
    });
    
    console.log(`📊 Total BOM items amount: ${total_amount}`);
    frm.refresh_field('custom_bom_items');
}

function update_main_item_prices_from_bom(frm) {
    console.log('🔄 Updating main item prices from BOM totals');
    
    if (!frm.doc.custom_bom_items || frm.doc.custom_bom_items.length === 0) {
        return;
    }
    
    // Calculate total amount for each parent item from BOM items
    let parent_item_totals = {};
    
    frm.doc.custom_bom_items.forEach(function(bom_item) {
        if (bom_item.parent_quotation_item) {
            if (!parent_item_totals[bom_item.parent_quotation_item]) {
                parent_item_totals[bom_item.parent_quotation_item] = 0;
            }
            parent_item_totals[bom_item.parent_quotation_item] += bom_item.amount;
        }
    });
    
    // Update the main items with the calculated totals
    frm.doc.items.forEach(function(item) {
        if (item.bom && parent_item_totals[item.name]) {
            frappe.model.set_value('Quotation Item', item.name, 'rate', parent_item_totals[item.name] / (item.qty || 1));
            frappe.model.set_value('Quotation Item', item.name, 'amount', parent_item_totals[item.name]);
        }
    });
    
    frm.refresh_field('items');
}

function show_bom_expand_suggestion(frm) {
    // Show a suggestion to expand BOMs if there are items with BOMs
    let has_unexpanded_boms = frm.doc.items.some(item => item.bom);
    let has_bom_items_table = frm.doc.custom_bom_items && frm.doc.custom_bom_items.length > 0;
    
    if (has_unexpanded_boms && !has_bom_items_table) {
        frappe.show_alert({
            message: __('Items with BOMs detected. Use "Expand BOMs to Table" to show detailed components.'),
            indicator: 'blue'
        }, 7);
    }
}

function set_default_construction_values(frm) {
    console.log('🎯 Setting default construction values');
    
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
    console.log('🚀 Creating project from quotation');
    
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
            }
        });
    }, __('Create Project'), __('Create'));
}