# ERPNext Quotation Implementation Guide - Complete Step-by-Step

## OVERVIEW OF THE APPROACH

We'll create a quotation system with:

1. **Main Table**: Standard quotation items (like your main Aluminum Gate)
2. **Detail Table**: BOM breakdown showing sub-components and specifications
3. **Client Scripts**: To automatically populate detail table from BOM

---

## PHASE 1: MODIFY QUOTATION DOCTYPE

### Step 1: Access DocType Customization

```
1. Go to ERPNext > Developer > Customize Form
2. Search for "Quotation" and select it
3. You'll see the form layout with existing fields
```

### Step 2: Add Custom Fields

We need to add custom fields for our implementation:

#### A. Add Detail Table Field

1. **Click "Add Field"** after the existing "Items" table
2. **Field Settings:**
   - Label: `BOM Item Details`
   - Fieldname: `bom_item_details`
   - Field Type: `Table`
   - Options: `Quotation BOM Item` (we'll create this child table next)
   - Insert After: `items`

#### B. Add Section Headers

1. **Add a Section Break** before BOM table:

   - Label: `Detailed Breakdown`
   - Fieldname: `bom_section_break`
   - Field Type: `Section Break`

2. **Add a Column Break** (optional for layout):
   - Fieldname: `bom_column_break`
   - Field Type: `Column Break`

#### C. Add Summary Fields

1. **Total BOM Amount** (read-only):
   - Label: `Total BOM Amount`
   - Fieldname: `total_bom_amount`
   - Field Type: `Currency`
   - Read Only: ✓

### Step 3: Create Child Table DocType

1. **Go to:** Developer > DocType > New
2. **DocType Settings:**

   - DocType Name: `Quotation BOM Item`
   - Module: `Selling`
   - Is Child Table: ✓
   - Is Submittable: ✗

3. **Add Fields to Child Table:**

```javascript
// Field 1: Serial Number
{
    "label": "Sl#",
    "fieldname": "sl_no",
    "fieldtype": "Data",
    "width": "50px"
}

// Field 2: Location
{
    "label": "Location",
    "fieldname": "location",
    "fieldtype": "Data",
    "width": "100px"
}

// Field 3: Task
{
    "label": "Task",
    "fieldname": "task",
    "fieldtype": "Data",
    "width": "120px"
}

// Field 4: Scope of Work
{
    "label": "Scope of Work",
    "fieldname": "scope_of_work",
    "fieldtype": "Text Editor",
    "width": "300px"
}

// Field 5: Quantity
{
    "label": "Qty",
    "fieldname": "qty",
    "fieldtype": "Float",
    "width": "80px"
}

// Field 6: Unit
{
    "label": "Unit",
    "fieldname": "unit",
    "fieldtype": "Data",
    "width": "80px"
}

// Field 7: Unit Rate
{
    "label": "Unit Rate",
    "fieldname": "unit_rate",
    "fieldtype": "Currency",
    "width": "100px"
}

// Field 8: Total Cost
{
    "label": "Total Cost",
    "fieldname": "total_cost",
    "fieldtype": "Currency",
    "width": "100px",
    "read_only": 1
}

// Field 9: Remarks
{
    "label": "Remarks",
    "fieldname": "remarks",
    "fieldtype": "Text",
    "width": "150px"
}

// Field 10: Item Code (hidden, for reference)
{
    "label": "Item Code",
    "fieldname": "item_code",
    "fieldtype": "Link",
    "options": "Item",
    "hidden": 1
}
```

4. **Save the DocType**

---

## PHASE 2: CREATE ITEMS AND BOM

### Step 1: Create Main Item

1. **Go to:** Stock > Item > New
2. **Item Details:**
   - Item Code: `ALU-GATE-5200-2400`
   - Item Name: `Aluminum Sliding Gate 5200x2400mm`
   - Item Group: `Aluminum Works`
   - Stock UOM: `Nos`
   - Is Stock Item: ✗ (since it's assembled)

### Step 2: Create BOM Components

Create these individual items:

```javascript
// Component Items to Create:
1. ALU-FRAME-120X50X3 - Aluminum Frame Profile 120x50x3mm
2. ALU-TUBE-80X20 - Aluminum Vertical Tube 80x20mm
3. ALU-TUBE-40X20 - Aluminum Vertical Tube 40x20mm
4. ALU-TUBE-120X20 - Aluminum Vertical Tube 120x20mm
5. ALU-SHEET-PARTIAL - Aluminum Sheet Partial Block
6. STEEL-FLAT-75X8 - Steel Flat Bar 75x8mm
7. WHEEL-SS-BEARING - SS Heavy Duty Wheel with Bearing
8. GUIDE-ROLLER - Guide Roller & Wheels
9. POWDER-COATING - White Powder Coating Service
10. TRANSPORTATION - Transportation Service
```

### Step 3: Create BOM

1. **Go to:** Manufacturing > BOM > New
2. **BOM Details:**

   - Item: `ALU-GATE-5200-2400`
   - Quantity: `1`
   - UOM: `Nos`

3. **Add BOM Items:**

```javascript
// BOM Structure:
[
  {
    item_code: "ALU-FRAME-120X50X3",
    qty: 26.4, // Calculated based on gate perimeter
    uom: "Meter",
    rate: 45.0,
  },
  {
    item_code: "ALU-TUBE-80X20",
    qty: 15.6,
    uom: "Meter",
    rate: 35.0,
  },
  {
    item_code: "ALU-SHEET-PARTIAL",
    qty: 12.48, // Area in sqm
    uom: "Sqm",
    rate: 120.0,
  },
  // ... add all components
];
```

---

## PHASE 3: CLIENT SCRIPTS

### Script 1: Main Quotation Client Script

Create this in: **Selling > Client Script > New**

The Code can be accessed [here](./Quotation%20code/Quotaton%20BOM%20v4.js).

---

## PHASE 4: TESTING & VALIDATION

### Test Scenario 1: Create Quotation

1. **Create New Quotation**
2. **Add Main Item:** ALU-GATE-5200-2400
3. **Expected Result:** BOM details automatically populate
4. **Check Console:** Look for log messages

### Test Scenario 2: Multiple Items

1. **Add multiple items with BOMs**
2. **Expected Result:** Each item's BOM details appear separately
3. **Verify:** Total calculations are correct

### Debugging Tips

```javascript
// Add this to any function for debugging
console.log("Current frm:", frm);
console.log("Current doc:", frm.doc);
console.log("BOM items:", frm.doc.bom_item_details);

// Check if scripts are loading
console.log("Quotation client script loaded");
```

---

## PHASE 5: ADVANCED FEATURES

### Feature 1: Print Format Customization

Create custom print format to show both tables properly.

### Feature 2: Validation Scripts

Add server-side validation for BOM consistency.

### Feature 3: Report Generation

Create reports for BOM analysis and costing.

---

## TROUBLESHOOTING GUIDE

### Common Issues:

1. **BOM not populating:**

   - Check if BOM exists and is active
   - Verify item codes match exactly
   - Check console for errors

2. **Calculations wrong:**

   - Verify unit rates in BOM
   - Check currency settings
   - Ensure all fields are numeric

3. **Script not running:**
   - Clear browser cache
   - Check script syntax
   - Verify DocType names

### Debug Commands:

```javascript
// Check current form data
console.log(cur_frm.doc);

// Check if field exists
console.log(cur_frm.fields_dict.bom_item_details);

// Manual calculation trigger
calculate_total_bom_amount(cur_frm);
```

## [Back to Implementation](./readme.md)

