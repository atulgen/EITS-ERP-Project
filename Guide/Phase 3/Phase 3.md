### Phase 3: Job Estimation System (Week 5-6)

**Objective:** Develop comprehensive job estimation and quotation system

**Deliverables:**

1. Site Measurement DocType
2. Job Estimation DocType
3. Enhanced Quotation with job-specific fields
4. Material and manpower calculation tools



# PHASE 3: Job Estimation System (Week 5-6)

## Step 1: Create Job Estimation DocType

### 1.1 Create Main DocType

1. **Navigate:** Build → DocType → New DocType
2. **Configuration:**

```
DocType Name: Job Estimation
Module: EITS App
Is Submittable: ✅ Yes
Track Changes: ✅ Yes
```

### 1.2 Add Fields to Job Estimation

**Header Section:**

```
Field 1:
- Type: Data
- Label: Estimation ID
- Field Name: estimation_id
- Hidden: ✅
- Read Only: ✅
- Default: EST-.####

Field 2:
- Type: Link
- Label: Site Inspection
- Field Name: site_inspection
- Options: Site Inspection
- Reqd: ✅
- In List View: ✅

Field 3:
- Type: Link
- Label: Customer
- Field Name: customer
- Options: Customer
- Fetch From: site_inspection.lead.customer
- Read Only: ✅

Field 4:
- Type: Column Break

Field 5:
- Type: Date
- Label: Estimation Date
- Field Name: estimation_date
- Default: Today
- Reqd: ✅
- In List View: ✅

Field 6:
- Type: Link
- Label: Estimated By
- Field Name: estimated_by
- Options: Employee
- Reqd: ✅

Field 7:
- Type: Select
- Label: Estimation Status
- Field Name: estimation_status
- Options:
  Draft
  Submitted
  Under Review
  Approved
  Rejected
  Revision Required
- Default: Draft
- In List View: ✅
```

**Job Categories Section:**

```
Field 8:
- Type: Section Break
- Label: Job Categories Required

Field 9:
- Type: Table
- Label: Job Categories
- Field Name: job_categories
- Options: Job Category Detail
```

**Create Job Category Detail Child Table:**

1. **New DocType:** Job Category Detail
2. **Configuration:**
   ```
   DocType Name: Job Category Detail
   Is Child Table: ✅ Yes
   Module: EITS App
   ```

3. **Fields for Job Category Detail:**
   ```
   Field 1:
   - Type: Select
   - Label: Job Category
   - Field Name: job_category
   - Options:
     Furnitures & Fixtures
     Equipment Installation
     Electrical Services
     AC & Refrigeration
     Painting & Decorating
     Plumbing Services
     Construction Services
     Trading Services
   - In List View: ✅
   - Reqd: ✅

   Field 2:
   - Type: Data
   - Label: Sub Category
   - Field Name: sub_category
   - In List View: ✅

   Field 3:
   - Type: Data
   - Label: Department Required
   - Field Name: department
   - In List View: ✅

   Field 4:
   - Type: Select
   - Label: Priority
   - Field Name: priority
   - Options:
     High
     Medium
     Low
   - Default: Medium
   - In List View: ✅

   Field 5:
   - Type: Float
   - Label: Estimated Hours
   - Field Name: estimated_hours
   - Precision: 2

   Field 6:
   - Type: Currency
   - Label: Estimated Cost
   - Field Name: estimated_cost
   - In List View: ✅

   Field 7:
   - Type: Text
   - Label: Notes
   - Field Name: notes
   ```

**Material Requirements Section:**

```
Field 10:
- Type: Section Break
- Label: Material Requirements

Field 11:
- Type: Table
- Label: Materials
- Field Name: materials
- Options: Material Estimation
```

**Create Material Estimation Child Table:**

1. **New DocType:** Material Estimation
2. **Configuration:**
   ```
   DocType Name: Material Estimation
   Is Child Table: ✅ Yes
   Module: EITS App
   ```

3. **Fields for Material Estimation:**
   ```
   Field 1:
   - Type: Link
   - Label: Item
   - Field Name: item_code
   - Options: Item
   - In List View: ✅
   - Reqd: ✅

   Field 2:
   - Type: Data
   - Label: Item Name
   - Field Name: item_name
   - Fetch From: item_code.item_name
   - Read Only: ✅
   - In List View: ✅

   Field 3:
   - Type: Float
   - Label: Quantity
   - Field Name: qty
   - Precision: 2
   - In List View: ✅
   - Reqd: ✅

   Field 4:
   - Type: Link
   - Label: UOM
   - Field Name: uom
   - Options: UOM
   - Fetch From: item_code.stock_uom
   - In List View: ✅

   Field 5:
   - Type: Currency
   - Label: Rate
   - Field Name: rate
   - Precision: 2
   - In List View: ✅
   - Reqd: ✅

   Field 6:
   - Type: Currency
   - Label: Amount
   - Field Name: amount
   - Read Only: ✅
   - In List View: ✅
   - Formula: qty * rate

   Field 7:
   - Type: Select
   - Label: Availability
   - Field Name: availability
   - Options:
     In Stock
     Need to Purchase
     Special Order
   - Default: Need to Purchase

   Field 8:
   - Type: Text
   - Label: Specification
   - Field Name: specification
   ```

**Manpower Requirements Section:**

```
Field 12:
- Type: Section Break
- Label: Manpower Requirements

Field 13:
- Type: Table
- Label: Manpower
- Field Name: manpower
- Options: Manpower Estimation
```

**Create Manpower Estimation Child Table:**

1. **New DocType:** Manpower Estimation
2. **Configuration:**
   ```
   DocType Name: Manpower Estimation
   Is Child Table: ✅ Yes
   Module: EITS App
   ```

3. **Fields for Manpower Estimation:**
   ```
   Field 1:
   - Type: Data
   - Label: Skill Set
   - Field Name: skill_set
   - In List View: ✅
   - Reqd: ✅
   - Options:
     Carpenter
     Electrician
     Plumber
     Painter
     AC Technician
     General Labor
     Supervisor
     Foreman

   Field 2:
   - Type: Int
   - Label: Number of Workers
   - Field Name: no_of_workers
   - In List View: ✅
   - Reqd: ✅

   Field 3:
   - Type: Float
   - Label: Hours per Day
   - Field Name: hours_per_day
   - Default: 8
   - In List View: ✅

   Field 4:
   - Type: Int
   - Label: Number of Days
   - Field Name: no_of_days
   - In List View: ✅
   - Reqd: ✅

   Field 5:
   - Type: Float
   - Label: Total Hours
   - Field Name: total_hours
   - Read Only: ✅
   - Formula: no_of_workers * hours_per_day * no_of_days

   Field 6:
   - Type: Currency
   - Label: Rate per Hour
   - Field Name: rate_per_hour
   - In List View: ✅
   - Reqd: ✅

   Field 7:
   - Type: Currency
   - Label: Total Cost
   - Field Name: total_cost
   - Read Only: ✅
   - In List View: ✅
   - Formula: total_hours * rate_per_hour

   Field 8:
   - Type: Text
   - Label: Special Requirements
   - Field Name: special_requirements
   ```

**Timeline & Totals Section:**

```
Field 14:
- Type: Section Break
- Label: Project Timeline

Field 15:
- Type: Date
- Label: Estimated Start Date
- Field Name: estimated_start_date
- Reqd: ✅

Field 16:
- Type: Date
- Label: Estimated End Date
- Field Name: estimated_end_date
- Reqd: ✅

Field 17:
- Type: Int
- Label: Total Working Days
- Field Name: total_working_days
- Read Only: ✅

Field 18:
- Type: Column Break

Field 19:
-
1. **Navigate:** B