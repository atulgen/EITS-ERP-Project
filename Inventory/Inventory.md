# Complete Guide to Adding Items in ERPNext

## Table of Contents
1. [Item Groups Setup](#item-groups-setup)
2. [Units of Measure (UOM)](#units-of-measure-uom)
3. [Creating Items](#creating-items)
4. [Item Variants](#item-variants)
5. [Price Lists](#price-lists)
6. [Item Prices](#item-prices)
7. [Inventory Management Settings](#inventory-management-settings)
8. [Best Practices](#best-practices)

---

## 1. Item Groups Setup

Item Groups help organize your inventory into logical categories.

### Creating Item Groups
1. **Navigate to:** Stock → Setup → Item Group
2. **Click:** New
3. **Fill in:**
   - **Item Group Name:** E.g., "Electronics", "Furniture", "Raw Materials"
   - **Parent Item Group:** Select an existing group or leave as "All Item Groups"
   - **Is Group:** Check if this will contain sub-groups
   - **Default Tax Template:** Optional tax template for items in this group

### Item Group Hierarchy Example
```
All Item Groups
├── Finished Goods
│   ├── Electronics
│   └── Furniture
├── Raw Materials
│   ├── Metals
│   └── Plastics
└── Services
```

---

## 2. Units of Measure (UOM)

Set up the units you'll use for measuring items.

### Creating UOM
1. **Navigate to:** Stock → Setup → UOM
2. **Click:** New
3. **Common UOMs:**
   - Nos (Numbers/Pieces)
   - Kg (Kilograms)
   - Meter
   - Liter
   - Box
   - Dozen

### UOM Conversion
Create conversions between related units:
- 1 Dozen = 12 Nos
- 1 Kg = 1000 Grams
- 1 Meter = 100 Centimeters

---

## 3. Creating Items

### Basic Item Creation
1. **Navigate to:** Stock → Item
2. **Click:** New
3. **Required Fields:**

#### Basic Information
- **Item Code:** Unique identifier (auto-generated or custom)
- **Item Name:** Descriptive name
- **Item Group:** Select appropriate group
- **Default Unit of Measure:** Primary UOM
- **Disabled:** Uncheck to keep item active

#### Item Type Options
- **Stock Item:** Physical inventory item (trackable)
- **Non-Stock Item:** Services or non-trackable items
- **Fixed Asset:** Items that are assets

#### Inventory Settings
- **Maintain Stock:** Check for stock items
- **Include Item in Manufacturing:** For production items
- **Is Purchase Item:** Can be purchased
- **Is Sales Item:** Can be sold
- **Is Stock Item:** Tracks inventory levels

#### Accounting Settings
- **Valuation Method:** FIFO, Moving Average, or LIFO
- **Default Income Account:** Revenue account
- **Default Expense Account:** Cost account

### Advanced Item Settings

#### Inventory Tab
- **Shelf Life in Days:** For perishable items
- **End of Life:** Discontinuation date
- **Default Material Request Type:** Purchase/Manufacture/Transfer
- **Valuation Rate:** Standard cost

#### Purchase Tab
- **Default Purchase Unit of Measure**
- **Minimum Order Qty**
- **Safety Stock**
- **Purchase UOM Conversion Factor**
- **Lead Time Days**

#### Sales Tab
- **Default Sales Unit of Measure**
- **Max Discount %**
- **Sales UOM Conversion Factor**

#### Accounting Tab
- **Item Tax Template:** Default taxes for this item
- **Default Income Account**
- **Default Expense Account**
- **Default Cost Center**

---

## 4. Item Variants

Create variants for items with different attributes (size, color, etc.).

### Setting Up Item Variants
1. **Enable Variants** in the item master
2. **Create Item Attributes:**
   - Navigate to: Stock → Setup → Item Attribute
   - Examples: Size (S, M, L, XL), Color (Red, Blue, Green)

3. **Add Attributes to Template:**
   - In item master, go to "Attributes" section
   - Add relevant attributes

4. **Create Variants:**
   - Click "Create Variant" from item master
   - Select attribute combinations
   - System generates variant codes automatically

### Example: T-Shirt Variants
- Template: T-SHIRT-TEMPLATE
- Variants: 
  - T-SHIRT-TEMPLATE-RED-S
  - T-SHIRT-TEMPLATE-BLUE-M
  - T-SHIRT-TEMPLATE-GREEN-L

---

## 5. Price Lists

Price Lists allow different pricing for different customer groups or scenarios.

### Creating Price Lists
1. **Navigate to:** Selling → Setup → Price List
2. **Click:** New
3. **Configure:**
   - **Price List Name:** E.g., "Standard Selling", "Wholesale", "Retail"
   - **Currency:** Base currency
   - **Buying/Selling:** Purpose of the price list
   - **Enabled:** Keep checked

### Common Price List Types
- **Standard Selling:** Regular customer prices
- **Wholesale:** Bulk customer prices
- **Retail:** End customer prices
- **Standard Buying:** Supplier prices

---

## 6. Item Prices

Set specific prices for items in different price lists.

### Creating Item Prices
1. **Navigate to:** Stock → Item Price
2. **Click:** New
3. **Configure:**
   - **Item Code:** Select the item
   - **Price List:** Choose appropriate list
   - **Customer/Supplier:** Optional specific pricing
   - **Rate:** Price amount
   - **Valid From/Upto:** Date range for validity
   - **UOM:** Unit of measure for this price

### Bulk Price Updates
Use **Pricing Rule** for:
- Quantity-based discounts
- Customer group discounts
- Time-based pricing
- Promotional offers

#### Creating Pricing Rules
1. **Navigate to:** Accounts → Pricing Rule
2. **Set conditions:**
   - Item/Item Group
   - Customer/Customer Group
   - Quantity ranges
   - Date ranges
3. **Set discounts:**
   - Percentage or fixed amount
   - Maximum discount limits

---

## 7. Inventory Management Settings

### Opening Stock Entry
After creating items, enter opening stock:

1. **Navigate to:** Stock → Stock Entry
2. **Select Purpose:** Material Receipt
3. **Add items with quantities and rates**
4. **Set Target Warehouse**
5. **Submit entry**

### Warehouse Setup
Ensure warehouses are created:
1. **Navigate to:** Stock → Setup → Warehouse
2. **Create location-specific warehouses**
3. **Set default warehouses in company settings**

### Reorder Levels
Set automatic reorder points:
1. **In Item Master → Inventory tab**
2. **Set Reorder Level and Reorder Qty**
3. **Configure Material Request auto-creation**

---

## 8. Best Practices

### Naming Conventions
- **Use consistent item codes:** PROD-CAT-###
- **Meaningful descriptions:** Include key specifications
- **Standard abbreviations:** Maintain company glossary

### Item Organization
- **Logical grouping:** Group related items together
- **Use variants wisely:** Don't over-complicate with too many attributes
- **Regular cleanup:** Disable obsolete items instead of deleting

### Price Management
- **Regular price reviews:** Schedule periodic updates
- **Version control:** Use effective dates for price changes
- **Approval workflow:** Implement approval process for price changes

### Stock Management
- **Accurate opening stock:** Essential for correct valuation
- **Regular stock reconciliation:** Monthly stock counts
- **Monitor slow-moving items:** Identify dead stock

### Integration Considerations
- **Barcode integration:** Enable barcode scanning
- **Supplier catalogs:** Import supplier item lists
- **E-commerce sync:** Connect with online stores

---

## Quick Checklist for New Item Setup

### Before Creating Items:
- [ ] Item Groups created
- [ ] UOMs defined
- [ ] Warehouses set up
- [ ] Price Lists created
- [ ] Tax templates configured

### For Each Item:
- [ ] Item master created
- [ ] Inventory settings configured
- [ ] Price lists updated
- [ ] Opening stock entered (if applicable)
- [ ] Reorder levels set
- [ ] Item tested in transaction

### After Item Creation:
- [ ] Train users on new items
- [ ] Update reports and dashboards
- [ ] Monitor stock levels
- [ ] Review item performance

---

## Common Troubleshooting

### Item Not Appearing in Transactions
- Check if item is enabled
- Verify "Is Purchase Item" or "Is Sales Item" is checked
- Ensure proper permissions

### Valuation Issues
- Check opening stock entries
- Verify valuation method settings
- Review stock reconciliation entries

### Price Not Updating
- Check price list validity dates
- Verify pricing rule conflicts
- Confirm customer/supplier specific pricing

### Variant Problems
- Ensure template item has variants enabled
- Check attribute values are defined
- Verify variant naming series

---

# Item and it's Price

Let me break down **Items** and **Item Prices** in simple terms with examples.

## What is an ITEM?

An **Item** is basically a product or service record in your system. Think of it as a digital catalog entry for everything you buy, sell, or manufacture.

### Simple Example:
Let's say you sell laptops. The **Item** would be:
- **Item Code**: LAP-001
- **Item Name**: Dell Laptop 15-inch
- **Description**: Dell Inspiron 15 3000 Series
- **Item Group**: Electronics
- **Unit**: Each/Nos

The Item is just the **product definition** - it tells ERPNext "this product exists" but doesn't include the price.

## What is an ITEM PRICE?

**Item Price** is where you set how much that item costs. One item can have multiple prices for different situations.

### Why separate Item and Price?
Because you might sell the same laptop at different prices to different customers:
- Regular customers: $800
- Wholesale customers: $750
- VIP customers: $700

## Step-by-Step Example

### Step 1: Create the Item First
1. Go to **Stock → Item → New**
2. Fill in:
   - **Item Code**: LAP-001
   - **Item Name**: Dell Laptop 15-inch
   - **Item Group**: Electronics
   - **Is Sales Item**: ✓ (checked)
   - **Stock Item**: ✓ (checked)

3. Save the item

*At this point, you have a product in your system, but no price set*

### Step 2: Create Price Lists
1. Go to **Selling → Setup → Price List → New**
2. Create these price lists:
   - **Standard Selling** (for regular customers)
   - **Wholesale** (for bulk buyers)
   - **VIP Customers** (for special customers)

### Step 3: Set Item Prices
Now you connect your item to different prices:

1. Go to **Stock → Item Price → New**
2. Create first price:
   - **Item Code**: LAP-001 (Dell Laptop)
   - **Price List**: Standard Selling
   - **Rate**: $800
   - Save

3. Create second price:
   - **Item Code**: LAP-001 (same laptop)
   - **Price List**: Wholesale
   - **Rate**: $750
   - Save

4. Create third price:
   - **Item Code**: LAP-001 (same laptop)
   - **Price List**: VIP Customers
   - **Rate**: $700
   - Save

## Real-World Scenario

**Your Business**: You sell office supplies

**Items you create**:
1. **Item**: Pen Blue Ballpoint
   - No price set yet
   
2. **Item**: A4 Paper Pack
   - No price set yet

**Price Lists you create**:
- Retail (individual customers)
- Wholesale (bulk buyers)
- Employee (company staff)

**Item Prices you set**:

For **Pen Blue Ballpoint**:
- Retail Price: $2.00
- Wholesale Price: $1.50
- Employee Price: $1.00

For **A4 Paper Pack**:
- Retail Price: $15.00
- Wholesale Price: $12.00
- Employee Price: $10.00

## How It Works in Sales

When you create a sales order:
1. You select the **customer**
2. ERPNext checks which **price list** is assigned to that customer
3. It automatically shows the correct **item price** from that price list

**Example**:
- Customer type: Wholesale → Uses "Wholesale" price list → Pen shows $1.50
- Customer type: Retail → Uses "Retail" price list → Pen shows $2.00

## Quick Summary

- **ITEM** = What you're selling (the product itself)
- **ITEM PRICE** = How much you're selling it for (can be different for different customers)

**Think of it like a restaurant menu**:
- The **Item** is "Chicken Burger" (the dish)
- The **Item Price** could be $10 for dine-in, $9 for takeaway, $8 for employees
