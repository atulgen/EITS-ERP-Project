frappe.ui.form.on('Lead', {
    refresh(frm) {
        // Add CSS for targeted fields only
        if (!$('#lead-specific-layout-css').length) {
            $('<style id="lead-specific-layout-css">')
                .text(`
                    /* Target only specific Lead form fields in mobile/tablet view */
                    @media (max-width: 768px) {
                        /* Create a container for targeted fields */
                        .lead-form-container {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 2%;
                        }
                        
                        /* Target only specified fields for 2-column layout */
                        .frappe-control[data-fieldname="first_name"],
                        .frappe-control[data-fieldname="last_name"],
                        .frappe-control[data-fieldname="middle_name"],
                        .frappe-control[data-fieldname="mobile_no"],
                        .frappe-control[data-fieldname="email_id"],
                        .frappe-control[data-fieldname="whatsapp_no"] {
                            width: 48% !important;
                            display: inline-block !important;
                            vertical-align: top !important;
                            margin-right: 2% !important;
                            margin-bottom: 15px !important;
                            box-sizing: border-box !important;
                        }
                        
                        /* Remove right margin for even positioned fields */
                        .frappe-control[data-fieldname="last_name"],
                        .frappe-control[data-fieldname="email_id"] {
                            margin-right: 0 !important;
                        }
                        
                        /* Job Type checkboxes in 2-column layout */
                        .frappe-control[data-fieldname="custom_painting__decorating"],
                        .frappe-control[data-fieldname="custom_furnitures__fixtures"],
                        .frappe-control[data-fieldname="custom_equipments"],
                        .frappe-control[data-fieldname="custom_electrical"],
                        .frappe-control[data-fieldname="custom_sanitary_plumbing_toilets__washroom"],
                        .frappe-control[data-fieldname="custom_other"] {
                            width: 48% !important;
                            display: inline-block !important;
                            vertical-align: top !important;
                            margin-right: 2% !important;
                            margin-bottom: 10px !important;
                            box-sizing: border-box !important;
                        }
                        
                        /* Remove right margin for even positioned job type fields */
                        .frappe-control[data-fieldname="custom_furnitures__fixtures"],
                        .frappe-control[data-fieldname="custom_electrical"],
                        .frappe-control[data-fieldname="custom_other"] {
                            margin-right: 0 !important;
                        }
                        
                        /* Keep full width for specific fields */
                        .frappe-control[data-fieldname="custom_address"],
                        .frappe-control[data-fieldname="company_name"],
                        .frappe-control[data-fieldname="lead_name"],
                        .frappe-control[data-fieldname="custom_misc_job_type"] {
                            width: 100% !important;
                            margin-right: 0 !important;
                        }
                        
                        /* Adjust checkbox labels to prevent overflow */
                        .frappe-control[data-fieldname="custom_painting__decorating"] .label-area,
                        .frappe-control[data-fieldname="custom_furnitures__fixtures"] .label-area,
                        .frappe-control[data-fieldname="custom_equipments"] .label-area,
                        .frappe-control[data-fieldname="custom_electrical"] .label-area,
                        .frappe-control[data-fieldname="custom_sanitary_plumbing_toilets__washroom"] .label-area,
                        .frappe-control[data-fieldname="custom_other"] .label-area {
                            font-size: 12px !important;
                            line-height: 1.3 !important;
                            word-wrap: break-word !important;
                        }
                        
                        /* Ensure form controls fit properly */
                        .frappe-control[data-fieldname="first_name"] .form-control,
                        .frappe-control[data-fieldname="last_name"] .form-control,
                        .frappe-control[data-fieldname="middle_name"] .form-control,
                        .frappe-control[data-fieldname="mobile_no"] .form-control,
                        .frappe-control[data-fieldname="email_id"] .form-control,
                        .frappe-control[data-fieldname="whatsapp_no"] .form-control {
                            width: 100% !important;
                            box-sizing: border-box !important;
                        }
                        
                        /* Adjust labels for targeted fields */
                        .frappe-control[data-fieldname="first_name"] .control-label,
                        .frappe-control[data-fieldname="last_name"] .control-label,
                        .frappe-control[data-fieldname="middle_name"] .control-label,
                        .frappe-control[data-fieldname="mobile_no"] .control-label,
                        .frappe-control[data-fieldname="email_id"] .control-label,
                        .frappe-control[data-fieldname="whatsapp_no"] .control-label {
                            font-size: 12px !important;
                            margin-bottom: 3px !important;
                        }
                    }
                    
                    /* Tablet adjustments for targeted fields only */
                    @media (min-width: 769px) and (max-width: 1024px) {
                        .frappe-control[data-fieldname="first_name"],
                        .frappe-control[data-fieldname="last_name"],
                        .frappe-control[data-fieldname="middle_name"],
                        .frappe-control[data-fieldname="mobile_no"],
                        .frappe-control[data-fieldname="email_id"],
                        .frappe-control[data-fieldname="whatsapp_no"] {
                            width: 48% !important;
                            display: inline-block !important;
                            vertical-align: top !important;
                            margin-right: 2% !important;
                        }
                        
                        .frappe-control[data-fieldname="last_name"],
                        .frappe-control[data-fieldname="email_id"] {
                            margin-right: 0 !important;
                        }
                        
                        /* Job Type checkboxes in 2-column layout for tablets */
                        .frappe-control[data-fieldname="custom_painting__decorating"],
                        .frappe-control[data-fieldname="custom_furnitures__fixtures"],
                        .frappe-control[data-fieldname="custom_equipments"],
                        .frappe-control[data-fieldname="custom_electrical"],
                        .frappe-control[data-fieldname="custom_sanitary_plumbing_toilets__washroom"],
                        .frappe-control[data-fieldname="custom_other"] {
                            width: 48% !important;
                            display: inline-block !important;
                            vertical-align: top !important;
                            margin-right: 2% !important;
                        }
                        
                        .frappe-control[data-fieldname="custom_furnitures__fixtures"],
                        .frappe-control[data-fieldname="custom_electrical"],
                        .frappe-control[data-fieldname="custom_other"] {
                            margin-right: 0 !important;
                        }
                    }
                `)
                .appendTo('head');
        }
        
        // Apply data attributes to target specific fields
        apply_field_attributes(frm);
    },
    
    onload(frm) {
        // Apply field attributes when form loads
        setTimeout(() => {
            apply_field_attributes(frm);
        }, 100);
    }
});

function apply_field_attributes(frm) {
    // Define the specific fields to target
    const targeted_fields = [
        'first_name',
        'last_name', 
        'middle_name',
        'mobile_no',
        'email_id',
        'whatsapp_no',
        'custom_address',
        'company_name',
        'lead_name',
        // Job Type checkboxes
        'custom_painting__decorating',
        'custom_furnitures__fixtures',
        'custom_equipments',
        'custom_electrical',
        'custom_sanitary_plumbing_toilets__washroom',
        'custom_other',
        'custom_misc_job_type'
    ];
    
    // Apply data-fieldname attributes only to targeted fields
    targeted_fields.forEach(fieldname => {
        if (frm.fields_dict[fieldname] && frm.fields_dict[fieldname].$wrapper) {
            frm.fields_dict[fieldname].$wrapper.attr('data-fieldname', fieldname);
        }
    });
}