frappe.ui.form.on('Lead', {
    // Initialize auto-save monitoring when form is loaded
    onload: function(frm) {
        setup_auto_save_monitoring(frm);
    },
    
    refresh: function(frm) {
        setup_auto_save_monitoring(frm);
    },
    
    // Monitor first_name changes
    first_name: function(frm) {
        check_and_auto_save(frm);
    },
    
    // Monitor contact field changes
    mobile_no: function(frm) {
        check_and_auto_save(frm);
    },
    
    email_id: function(frm) {
        check_and_auto_save(frm);
    },
    
    whatsapp_no: function(frm) {
        check_and_auto_save(frm);
    },
    
    // Monitor job type custom fields
    custom_painting__decorating: function(frm) {
        check_and_auto_save(frm);
    },
    
    custom_furnitures__fixtures: function(frm) {
        check_and_auto_save(frm);
    },
    
    custom_equipments: function(frm) {
        check_and_auto_save(frm);
    },
    
    custom_electrical: function(frm) {
        check_and_auto_save(frm);
    },
    
    custom_sanitary_plumbing_toilets__washroom: function(frm) {
        check_and_auto_save(frm);
    },
    
    custom_other: function(frm) {
        check_and_auto_save(frm);
    }
});

function setup_auto_save_monitoring(frm) {
    // Add visual indicator for auto-save status
    if (!frm.auto_save_indicator) {
        frm.auto_save_indicator = $(`
            <div class="auto-save-status" style="
                position: fixed; 
                top: 10px; 
                right: 10px; 
                background: #f8f9fa; 
                border: 1px solid #dee2e6; 
                border-radius: 4px; 
                padding: 8px 12px; 
                font-size: 12px; 
                z-index: 1000;
                display: none;
            ">
                <i class="fa fa-save"></i> Auto-save ready
            </div>
        `).appendTo('body');
    }
}

function check_and_auto_save(frm) {
    // Debounce to prevent excessive saves
    if (frm.auto_save_timeout) {
        clearTimeout(frm.auto_save_timeout);
    }
    
    frm.auto_save_timeout = setTimeout(() => {
        if (should_auto_save(frm)) {
            perform_auto_save(frm);
        }
    }, 1000); // Wait 1 second after last change
}

function should_auto_save(frm) {
    const doc = frm.doc;
    
    // Check if first_name is filled
    if (!doc.first_name || doc.first_name.trim() === '') {
        return false;
    }
    
    // Check if at least one contact method is filled
    const has_contact = (
        (doc.mobile_no && doc.mobile_no.trim() !== '') ||
        (doc.email_id && doc.email_id.trim() !== '') ||
        (doc.whatsapp_no && doc.whatsapp_no.trim() !== '')
    );
    
    if (!has_contact) {
        return false;
    }
    
    // Check if at least one job type is selected
    const has_job_type = (
        doc.custom_painting__decorating ||
        doc.custom_furnitures__fixtures ||
        doc.custom_equipments ||
        doc.custom_electrical ||
        doc.custom_sanitary_plumbing_toilets__washroom ||
        doc.custom_other
    );
    
    if (!has_job_type) {
        return false;
    }
    
    // Only auto-save if the document is dirty (has unsaved changes)
    return frm.is_dirty();
}

function perform_auto_save(frm) {
    // Show auto-save indicator
    if (frm.auto_save_indicator) {
        frm.auto_save_indicator.show().css('background', '#d4edda');
        frm.auto_save_indicator.find('i').removeClass('fa-save').addClass('fa-spinner fa-spin');
        frm.auto_save_indicator.html('<i class="fa fa-spinner fa-spin"></i> Auto-saving...');
    }
    
    // Perform the save
    frm.save().then(() => {
        // Show success indicator
        if (frm.auto_save_indicator) {
            frm.auto_save_indicator.css('background', '#d1ecf1');
            frm.auto_save_indicator.html('<i class="fa fa-check"></i> Auto-saved successfully');
            
            // Hide indicator after 3 seconds
            setTimeout(() => {
                frm.auto_save_indicator.fadeOut();
            }, 3000);
        }
        
        // Show toast notification
        frappe.show_alert({
            message: __('Lead auto-saved successfully'),
            indicator: 'green'
        }, 3);
        
    }).catch((error) => {
        // Show error indicator
        if (frm.auto_save_indicator) {
            frm.auto_save_indicator.css('background', '#f8d7da');
            frm.auto_save_indicator.html('<i class="fa fa-exclamation-triangle"></i> Auto-save failed');
        }
        
        // Show error notification
        frappe.show_alert({
            message: __('Auto-save failed: ') + (error.message || 'Unknown error'),
            indicator: 'red'
        }, 5);
        
        console.error('Auto-save error:', error);
    });
}

// Optional: Add keyboard shortcut to toggle auto-save
frappe.ui.keys.add_shortcut({
    shortcut: 'ctrl+shift+s',
    action: () => {
        const frm = cur_frm;
        if (frm && frm.doctype === 'Lead') {
            if (should_auto_save(frm)) {
                perform_auto_save(frm);
            } else {
                frappe.show_alert({
                    message: __('Auto-save conditions not met'),
                    indicator: 'orange'
                }, 3);
            }
        }
    },
    description: 'Manual trigger for Lead auto-save'
});