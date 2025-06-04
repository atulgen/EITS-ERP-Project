# ERPNext Forms Mapping & Custom App Development Guide

## 1. ERPNext Standard Doctype Mapping

### Master Data Forms

| Your Form              | ERPNext Standard Doctype  | Notes                                 |
| ---------------------- | ------------------------- | ------------------------------------- |
| Customer Form          | **Customer**              | Direct mapping                        |
| Supplier Form          | **Supplier**              | Direct mapping                        |
| Material Category Form | **Item Group**            | Maps to item categorization           |
| Material Form          | **Item**                  | Direct mapping for materials/products |
| Unit of Material Form  | **UOM** (Unit of Measure) | Direct mapping                        |
| Employee Form          | **Employee**              | Direct mapping                        |
| Currency Form          | **Currency**              | Direct mapping                        |
| Customer Group Form    | **Customer Group**        | Direct mapping                        |
| Supplier Group Form    | **Supplier Group**        | Direct mapping                        |
| Material Group Form    | **Item Group**            | Direct mapping                        |
| Job Group Form         | **Project Type**          | Custom doctype recommended            |

### Transaction Forms - Sales Cycle

| Your Form                  | ERPNext Standard Doctype    | Notes                                                     |
| -------------------------- | --------------------------- | --------------------------------------------------------- |
| Job Inquiry Form           | **Lead** or **Opportunity** | Lead for initial inquiry, Opportunity for qualified leads |
| Inquiry Assignment Form    | **Task**                    | Assign inquiry handling to employees                      |
| Site Measurement Form      | **Custom Doctype**          | No direct mapping - create custom                         |
| Job Estimation Form        | **Quotation** (Draft)       | Use quotation in draft state                              |
| Job Quotation Form         | **Quotation**               | Direct mapping                                            |
| Quotation Negotiation Form | **Custom Doctype**          | Track negotiation history                                 |
| Job Contract Form          | **Sales Order**             | Convert quotation to sales order                          |
| Job Assignment Form        | **Project**                 | Create project from sales order                           |

### Project Execution Forms

| Your Form                   | ERPNext Standard Doctype            | Notes                            |
| --------------------------- | ----------------------------------- | -------------------------------- |
| Job Followup Form           | **Task** or **Project Update**      | Track project progress           |
| Job Completion Form         | **Delivery Note** + **Project**     | Mark project complete + delivery |
| Jobs Day Progress Form      | **Timesheet** or **Project Update** | Daily progress tracking          |
| Project Daily Progress Form | **Project Update**                  | Direct mapping                   |
| Project Input Form          | **Project**                         | Project master data              |

### Inventory & Materials

| Your Form              | ERPNext Standard Doctype           | Notes                       |
| ---------------------- | ---------------------------------- | --------------------------- |
| Material Issue Form    | **Stock Entry** (Material Issue)   | Direct mapping              |
| Material Receipt Form  | **Stock Entry** (Material Receipt) | Direct mapping              |
| Physical Stock Form    | **Stock Reconciliation**           | Physical stock verification |
| Material Location Form | **Warehouse**                      | Storage locations           |

### Human Resources

| Your Form                       | ERPNext Standard Doctype               | Notes                      |
| ------------------------------- | -------------------------------------- | -------------------------- |
| Manpower Issue Form             | **Task Assignment**                    | Assign workers to projects |
| Manpower Time Log Form          | **Timesheet**                          | Track working hours        |
| Employee Salary Form            | **Salary Structure** + **Salary Slip** | Payroll management         |
| Employee Visa, Passport ID Form | **Custom Doctype**                     | No standard mapping        |
| Employee Day Book Form          | **Timesheet**                          | Daily work log             |

### Financial Forms

| Your Form                 | ERPNext Standard Doctype | Notes                    |
| ------------------------- | ------------------------ | ------------------------ |
| Invoice Form              | **Sales Invoice**        | Direct mapping           |
| Collection Follow up Form | **Payment Request**      | Follow up on payments    |
| Invoice Receipt Form      | **Payment Entry**        | Record payments received |
| Currency Exchange Form    | **Currency Exchange**    | Direct mapping           |
| VAT Rate Form             | **Tax Template**         | Tax configuration        |

### Procurement Forms

| Your Form                      | ERPNext Standard Doctype  | Notes                     |
| ------------------------------ | ------------------------- | ------------------------- |
| Purchase Inquiry Form          | **Request for Quotation** | Supplier inquiries        |
| Purchase Order Form            | **Purchase Order**        | Direct mapping            |
| Quotation Entry Form           | **Supplier Quotation**    | Supplier quotes           |
| Purchase Quotation Review Form | **Supplier Quotation**    | Review and compare quotes |

### Configuration & Setup

| Your Form                        | ERPNext Standard Doctype           | Notes                   |
| -------------------------------- | ---------------------------------- | ----------------------- |
| Dimensions Form                  | **Accounting Dimension**           | Custom dimensions       |
| Users Role Form                  | **Role** + **User**                | User management         |
| Document Type Form               | **Custom Doctype**                 | Document categorization |
| Weekly KPI Form                  | **Dashboard** or **Custom Report** | KPI tracking            |
| Pending Job Status & Review Form | **Custom Report**                  | Status dashboard        |

## 2. Recommended Custom Doctypes

For your specific construction/project workflow, I recommend creating these custom doctypes:

### 2.1 Site Measurement

```python
# Fields needed:
- project (Link to Project)
- measurement_date (Date)
- site_dimensions (Table)
- measurements_by (Link to Employee)
- status (Select: Draft, Submitted, Approved)
```

### 2.2 Quotation Negotiation

```python
# Fields needed:
- quotation (Link to Quotation)
- negotiation_round (Int)
- customer_feedback (Text)
- revised_amount (Currency)
- negotiation_date (Date)
- status (Select: Open, Accepted, Rejected)
```

### 2.3 Employee Documents

```python
# Fields needed:
- employee (Link to Employee)
- document_type (Select: Visa, Passport, ID, etc.)
- document_number (Data)
- issue_date (Date)
- expiry_date (Date)
- attachment (Attach)
```

## 3. Workflow Mapping: Inquiry to Delivery

### Stage 1: Lead Generation & Qualification

1. **Job Inquiry Form** → **Lead** doctype
2. **Inquiry Assignment Form** → **Task** (assign lead to sales person)

### Stage 2: Site Assessment & Estimation

3. **Site Measurement Form** → **Custom Doctype**
4. **Job Estimation Form** → **Quotation** (draft status)

### Stage 3: Quotation & Negotiation

5. **Job Quotation Form** → **Quotation** (submitted)
6. **Quotation Negotiation Form** → **Custom Doctype**

### Stage 4: Contract & Project Initiation

7. **Job Contract Form** → **Sales Order**
8. **Job Assignment Form** → **Project** (auto-created from Sales Order)

### Stage 5: Project Execution

9. **Material Issue Form** → **Stock Entry**
10. **Manpower Issue Form** → **Task Assignment**
11. **Jobs Day Progress Form** → **Timesheet** + **Project Update**

### Stage 6: Completion & Billing

12. **Job Completion Form** → **Delivery Note** + **Project** (status: Completed)
13. **Invoice Form** → **Sales Invoice**
14. **Collection Follow up Form** → **Payment Request**

## 4. ERPNext Custom App Development Steps

### Step 1: Environment Setup

```bash
# Install Bench
pip install frappe-bench

# Create new site
bench new-site your-site-name

# Create custom app
bench new-app construction_management
```

### Step 2: App Structure

```
construction_management/
├── construction_management/
│   ├── construction_management/
│   │   ├── doctype/           # Custom doctypes
│   │   ├── page/             # Custom pages
│   │   ├── report/           # Custom reports
│   │   └── dashboard/        # Custom dashboards
│   ├── public/               # CSS, JS files
│   └── templates/            # Web templates
```

### Step 3: Create Custom Doctypes

Use ERPNext's built-in Doctype creation tool:

1. Go to Setup → Customize → DocType
2. Create new DocType
3. Define fields, permissions, workflow

### Step 4: Workflow Configuration

1. Setup → Workflow → Workflow
2. Define states and transitions
3. Assign roles and permissions

### Step 5: Custom Scripts and Automation

- Client scripts for form behavior
- Server scripts for business logic
- Email alerts and notifications

## 5. Development Best Practices

### 5.1 Follow ERPNext Conventions

- Use standard naming conventions
- Follow ERPNext's MVC pattern
- Utilize built-in validations

### 5.2 Leverage Standard Features

- Use existing doctypes where possible
- Extend standard functionality rather than recreating
- Utilize ERPNext's role-based permissions

### 5.3 Custom Field Strategy

- Add custom fields to standard doctypes when needed
- Use Custom Field doctype for easier maintenance
- Group related custom fields logically

## 6. Implementation Roadmap

### Phase 1: Master Data Setup (Week 1-2)

- Configure Customer, Supplier, Items
- Setup employees and user roles
- Configure currency and tax templates

### Phase 2: Sales Cycle (Week 3-4)

- Lead management setup
- Quotation process configuration
- Custom site measurement doctype

### Phase 3: Project Execution (Week 5-6)

- Project management setup
- Timesheet and task configuration
- Material issue/receipt processes

### Phase 4: Financial Integration (Week 7-8)

- Invoice generation automation
- Payment tracking
- Financial reporting

### Phase 5: Custom Reports & Dashboard (Week 9-10)

- KPI dashboards
- Progress reports
- Management analytics

## 7. Technical Resources

### ERPNext Documentation

- Developer Guide: https://frappeframework.com/docs
- ERPNext User Manual: https://docs.erpnext.com
- API Documentation: https://frappeframework.com/docs/api

### Development Tools

- Frappe Framework (Python/JS)
- MariaDB/MySQL for database
- Redis for caching
- Nginx for web server

### Key Commands

```bash
# Install app
bench get-app construction_management

# Install app to site
bench --site your-site install-app construction_management

# Migrate after changes
bench --site your-site migrate

# Start development server
bench start
```

This mapping provides a comprehensive foundation for your construction management system in ERPNext. The key is to leverage existing functionality while creating targeted custom doctypes for your specific business processes.
