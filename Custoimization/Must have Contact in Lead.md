Perfect! You want to ensure that a lead must have at least one contact method (email OR phone OR WhatsApp). This requires **conditional validation** rather than making individual fields mandatory.

Here's how to implement this "at least one required" validation:

## Method 1: Custom Script (Recommended)

1. **Go to Custom Script**
   - Navigate to **Setup** → **Customizations** → **Custom Script**

2. **Create New Custom Script**
   - **DocType**: Lead
   - **Script Type**: Client
   - Add this code:

```javascript
frappe.ui.form.on('Lead', {
    validate: function(frm) {
        // Check if at least one contact method is provided
        if (!frm.doc.email_id && !frm.doc.mobile_no && !frm.doc.whatsapp_no) {
            frappe.msgprint(__('Please provide at least one contact method: Email, Mobile No, or WhatsApp'));
            frappe.validated = false;
        }
    }
});
```

## Method 2: Server Script (Alternative)

If you prefer server-side validation:

1. **Go to Server Script**
   - Navigate to **Setup** → **Customizations** → **Server Script**

2. **Create New Server Script**
   - **DocType**: Lead
   - **Script Type**: DocType Event
   - **DocType Event**: Before Save
   - Add this code:

```python
if not (doc.email_id or doc.mobile_no or doc.whatsapp_no):
    frappe.throw(_("Please provide at least one contact method: Email, Mobile No, or WhatsApp"))
```

## Method 3: Custom Field with Validation

You could also add a hidden custom field that validates this:

1. **Add Custom Field**
   - Go to **Customize Form** → **Lead**
   - Add a new field:
     - **Field Type**: Data
     - **Field Name**: contact_validation
     - **Hidden**: Yes

2. **Add Client Script** for this field:
```javascript
frappe.ui.form.on('Lead', {
    before_save: function(frm) {
        if (!frm.doc.email_id && !frm.doc.mobile_no && !frm.doc.whatsapp_no) {
            frappe.msgprint(__('At least one contact method is required'));
            frappe.validated = false;
        }
    }
});
```

## Field Names to Use

Make sure you use the correct field names in your validation:
- **Email**: `email_id` (not just `email`)
- **Mobile**: `mobile_no`
- **WhatsApp**: `whatsapp_no` (if it's a custom field, check the actual field name in Customize Form)

## Result

With this validation:
- Users can save a Lead with only email
- Users can save a Lead with only phone
- Users can save a Lead with only WhatsApp
- Users can save a Lead with any combination of the above
- Users **cannot** save a Lead without at least one contact method

The **Custom Script method** is usually the best approach as it's easier to maintain and modify later. Which method would you prefer to implement?