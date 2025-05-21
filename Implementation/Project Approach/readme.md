# Creating a Quotation in ERPNext Using the Project Approach

I'll guide you through creating this aluminum gate work quotation in ERPNext using the project approach, which is more appropriate for your construction/fabrication business than the Bill of Materials (BOM) approach.

## Overview of the Process

For service-oriented quotations like yours, the project approach makes more sense as it lets you organize work into tasks with associated costs. We'll follow these major steps:

1. Set up a Customer
2. Create a Project
3. Create Project Tasks and assign costs
4. Generate a Quotation linked to the Project
5. Add custom fields for Scope of Work details

Let's begin with a detailed step-by-step guide:

## Step 1: Set Up the Customer

1. Navigate to **Selling > Customer**
2. Click **+ New**
3. Enter the following details:
   - Customer Name: Hindu Temple Dubai
   - Customer Group: Commercial
   - Territory: Dubai
   - Address: Jebel Ali Village, Dubai
   - Contact Person: Mr. Shyju Parayil
   - Mobile No: +971545842950
   - Email ID: it@hindutempledubai.com, mohan@hindutempledubai.com
4. Save the customer record

## Step 2: Create a Project

1. Navigate to **Projects > Project**
2. Click **+ New**
3. Enter the following details:
   - Project Name: Aluminum Gate Work - JAV Hindu Temple
   - Customer: Hindu Temple Dubai
   - Expected Start Date: (Today's date)
   - Expected End Date: (3-4 weeks from today's date)
   - Status: Open
   - Project Type: External
   - Reference Quote No.: ET-QTN25-2891-00
4. Save the project

## Step 3: Create Project Tasks with Costing

1. In the saved Project, scroll to the **Tasks** section
2. Click **+ Add Row** and add the following tasks:

**Task 1:**
- Subject: Sliding Gate Fabrication & Installation
- Description: Fabrication, supply & installation of Aluminum white powder coated heavy duty sliding gate partial blocked view, all aluminum joints welded, sanded & buffed. Size 5200 x 2400 mm.
- Expected Start Date: (Project start date)
- Expected End Date: (Project start date + 3-4 days)
- Cost: 16,806.90 AED

**Task 2:**
- Subject: Aluminum Fix Panel Installation
- Description: Fabrication, supply & installation of aluminum Fix Panel partial blocked view, all aluminum joints welded, sanded & buffed. Size 1050x1500 mm using same material as gate.
- Expected Start Date: (Project start date)
- Expected End Date: (Project start date + 3-4 days)
- Cost: 1,815.00 AED

**Task 3:**
- Subject: Transportation
- Description: Transportation charge
- Expected Start Date: (Project start date)
- Expected End Date: (Project start date + 1 day)
- Cost: 407.00 AED

3. Save the project with tasks

## Step 4: Create the Quotation

1. Navigate to **Selling > Quotation**
2. Click **+ New**
3. Enter the following details:
   - Customer: Hindu Temple Dubai
   - Date: 12-05-25
   - Valid Till: 19-05-25 (7 days from quotation date)
   - Order Type: Sales
   - Project: Aluminum Gate Work - JAV Hindu Temple
   - Quotation To: Customer
   - Reference No.: ET-QTN25-2891-00

4. In the Items section, click **+ Add Row** and add the following items:

**Item 1:**
- Item Code: SLIDING-GATE-CUSTOM (create this item first if needed)
- Description: Fabrication, supply & installation of Aluminum white powder coated heavy duty sliding gate partial blocked view, all aluminum joints welded, sanded & buffed. Size 5200 x 2400 mm.
- Qty: 1
- UOM: Lot
- Rate: 16,806.90
- Amount: 16,806.90

**Item 2:**
- Item Code: FIX-PANEL-CUSTOM (create this item first if needed)
- Description: Fabrication, supply & installation of aluminum Fix Panel partial blocked view, all aluminum joints welded, sanded & buffed. Size 1050x1500 mm using same material as gate.
- Qty: 1
- UOM: Lot
- Rate: 1,815.00
- Amount: 1,815.00

**Item 3:**
- Item Code: TRANSPORTATION (create this item first if needed)
- Description: Transportation charge
- Qty: 1
- UOM: Lot
- Rate: 407.00
- Amount: 407.00

5. In the **Taxes and Charges** section:
   - Add VAT 5%: 951.45 AED
   - Total After Tax: 19,980.35 AED

6. In **Payment Terms**, add:
   - 50% advance payment
   - 50% upon completion

7. Save the quotation

## Step 5: Add Scope of Work and Terms & Conditions

1. In the quotation, find the **Terms and Conditions** section
2. Click **+ Add Terms and Conditions**
3. Create a new Terms template with the following:

```
Scope of work - M/s EITS LLC
1. Fabrication, supply & installation of Aluminum white powder coated heavy duty sliding gate partial blocked view, all aluminum joints welded.@ JAV Hindu Temple as per attached annex-01-00.
   - Any existing damage/electrical, mechanical part failure found during work will be notified & subject to additional cost as/if applicable.

Scope of work - Client
1. Access permit/Pass, any design related approval if applicable.
2. Welfare facilities for workforce. Utilities like power supply, light and water etc.
3. Equipment, power shutdown and restart shall be in client supervision and under his responsibility if applicable.

Terms & Conditions
Payment Terms:
- All invoices are subject to 5% VAT.
- 50% advance rest CDC immediate after work completion.

General Terms:
- Delivery within 3-4 weeks from the date of order confirmation with signed LPO.
- Work completion 3-4 working days from date of access & material availability.

Validity:
- Validity 7 Day from the date of Offer.

Bank Details:
A/C Name: Eco Innovative Technical Services LLC
Bank Name: National Bank of Um Al Quwain (NBQ)
Account No: 0086310167
Bank Address: Main branch, Khalid Bin Al Walid Street, Dubai
IBN: AE340420000000086310167
SWIFT Code: UMMQAEAD

Disclaimer: Works mentioned/quoted above are only limited to the provided photos/locations pertaining to photos within appendix A/site visit discussions. Any additions will be quoted separately as if to be done. For tiles/cladding/paint project approved products/RAL/Manufacturer/local supplier/technical details to be provided by client or similar products will be used. EITS will not hold responsible for any slight differences due to usage of similar products (in absence of information from client end).
```

4. Save the terms and conditions
5. Apply them to the quotation

## Step 6: Add Custom Fields for Scope of Work Details (Optional but Recommended)

To make your quotation more detailed with the scope of work like in your original document:

1. Navigate to **Customize Form**
2. Select **Quotation Item** in the form dropdown
3. Add these custom fields:
   - Field Label: Material Specifications
   - Type: Small Text
   - Insert After: Description
   
   And:
   - Field Label: Work Details
   - Type: Small Text
   - Insert After: Material Specifications

4. Save the customization

5. Go back to your quotation and add the detailed specifications for each item:

For Sliding Gate:
- Material Specifications: "Gate outer frame made with Aluminum profile 120x50x3 mm, Different aluminum vertical tubes (80x20 mm, 40x20 mm, 120x20 mm) on 40 mm gap. Backed with aluminum sheet."
- Work Details: "Steel flat bar 75x8 mm double length of gate length. Wheel with ball bearing SS heavy duty 4 nos. Guide roller & wheels at top 8 nos."

## Step 7: Print Format Customization

To make your quotation look exactly like the one in your document:

1. Navigate to **Print > Print Format Builder**
2. Select **Quotation** as the document type
3. Click **Create a New Format**
4. Name it "EITS Quotation Format"
5. Use the drag-and-drop builder to customize the layout:
   - Add your company logo at the top
   - Add "Quotation" as heading with reference number
   - Add customer information block
   - Create a table for items with columns matching your original quote
   - Add the detailed scope of work section
   - Add terms and conditions section
   - Add bank details section
   - Add signature section

6. Save the print format
7. Apply this format when printing your quotation

## Step 8: Submit and Send the Quotation

1. Review all details in the quotation
2. Click **Submit**
3. Click **Send Email** to send the quotation to the client
4. Attach any drawings or annexes mentioned in the quotation

## Additional Features to Explore

1. **Project Timeline**: Set milestones in the project to track progress
2. **Resource Planning**: Assign resources to tasks for better management
3. **Job Cards**: Create job cards for fabrication and installation tasks
4. **Material Request**: Generate material requests directly from the project
5. **Time Sheets**: Track labor hours for project costing

This approach gives you much better control over the service-oriented nature of your business compared to the BOM approach, which is more suitable for manufacturing.

## [Back to Implementation](../readme.md)