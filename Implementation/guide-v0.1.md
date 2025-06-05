# EITS ERPNext Customization Development Guide

## Executive Summary

This document provides a comprehensive guide for developing a customized ERPNext system for EITS (Equipment Installation and Technical Services). EITS specializes in fitouts, refurbishment, renovation, repair, maintenance, installation, construction, and trading services across multiple job categories including furniture & fixtures, electrical, AC/HVAC, painting, plumbing, and equipment installation.

## Table of Contents

1. [System Requirements & Environment Setup](#1-system-requirements--environment-setup)
2. [Initial Site Creation & App Development](#2-initial-site-creation--app-development)
3. [ERPNext Installation & Configuration](#3-erpnext-installation--configuration)
4. [Phase-wise Development Plan](#4-phase-wise-development-plan)
5. [Custom DocTypes Development](#5-custom-doctypes-development)
6. [Workflow Configuration](#6-workflow-configuration)
7. [Testing & Deployment](#7-testing--deployment)

---

## 1. System Requirements & Environment Setup

### 1.1 Prerequisites

**Hardware Requirements:**

- Minimum 4GB RAM (8GB recommended)
- 20GB free disk space
- Stable internet connection

**Software Requirements:**

- Ubuntu 20.04 LTS or later / macOS / Windows with WSL2
- Python 3.8+
- Node.js 16+
- Git

### 1.2 Install Frappe Bench

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3-dev python3-pip python3-venv
sudo apt install -y software-properties-common
sudo apt install -y mariadb-server mariadb-client
sudo apt install -y redis-server
sudo apt install -y curl
sudo apt install -y nginx

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install yarn
sudo npm install -g yarn

# Install wkhtmltopdf
sudo apt install -y wkhtmltopdf

# Install Frappe Bench
pip3 install frappe-bench

# Verify installation
bench --version
```

### 1.3 Database Configuration

```bash
# Secure MariaDB installation
sudo mysql_secure_installation

# Create database user for Frappe
sudo mysql -u root -p

# Inside MySQL prompt:
CREATE USER 'frappe'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON *.* TO 'frappe'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

---

## 2. Initial Site Creation & App Development

### 2.1 Create Frappe Bench

```bash
# Create a new bench (development environment)
bench init eits-bench --frappe-branch version-14

# Navigate to bench directory
cd eits-bench

# Create new site
bench new-site eits.local --admin-password admin --mariadb-root-password your_db_password

# Set site as default
bench use eits.local
```

### 2.2 Create Custom App

```bash
# Create EITS custom app
bench new-app eits_app

# Follow the prompts:
# App Title: EITS Management System
# App Description: Custom ERPNext app for Equipment Installation and Technical Services
# App Publisher: EITS
# App Email: admin@eits.local
# App Icon: fa fa-tools
# App Color: #2E8B57
```

### 2.3 Install Apps on Site

```bash
# Get ERPNext app
bench get-app erpnext --branch version-14

# Install ERPNext on site
bench --site eits.local install-app erpnext

# Install custom EITS app
bench --site eits.local install-app eits_app

# Start development server
bench start
```

**Access URLs:**

- Site: http://eits.local:8000
- Login: Administrator / admin

---

## 3. ERPNext Installation & Configuration

### 3.1 Initial ERPNext Setup

After accessing the site, complete the ERPNext setup wizard:

1. **Company Information:**

   - Company Name: EITS - Equipment Installation & Technical Services
   - Company Abbreviation: EITS
   - Default Currency: AED (or your local currency)
   - Country: UAE (or your country)
   - Timezone: Asia/Dubai (or your timezone)

2. **Chart of Accounts:**

   - Select "Standard Template"
   - Industry: "Services"

3. **Users Setup:**
   - Create initial users for different roles

### 3.2 Basic Master Data Setup

```python
# Create basic job categories as Item Groups
# Access: Stock → Setup → Item Group

Job Categories to Create:
1. Furnitures & Fixtures
2. Equipment Installation
3. Electrical Services
4. AC & Refrigeration
5. Painting & Decorating
6. Plumbing Services
7. Construction Services
8. Trading Services
```

---

## 4. Phase-wise Development Plan

### Phase 1: Foundation Setup (Week 1-2)

**Objective:** Establish core master data and basic CRM functionality

**Deliverables:**

1. Custom Job Categories setup
2. Service Items configuration
3. Customer and Supplier master data
4. Employee master data
5. Basic user roles and permissions

### Phase 2: Lead Management Enhancement (Week 3-4)

**Objective:** Implement EITS-specific lead capture and qualification process

**Deliverables:**

1. Custom Lead form with EITS-specific fields
2. Site Inspection scheduling system
3. Lead assignment workflow
4. Customer inquiry management

### Phase 3: Job Estimation System (Week 5-6)

**Objective:** Develop comprehensive job estimation and quotation system

**Deliverables:**

1. Site Measurement DocType
2. Job Estimation DocType
3. Enhanced Quotation with job-specific fields
4. Material and manpower calculation tools

### Phase 4: Project Execution Management (Week 7-8)

**Objective:** Implement project tracking and resource management

**Deliverables:**

1. Job Assignment system
2. Daily progress tracking
3. Material issue/receipt workflow
4. Manpower allocation and timesheet integration

### Phase 5: Financial Integration (Week 9-10)

**Objective:** Complete financial workflow integration

**Deliverables:**

1. Automated invoicing
2. Payment tracking
3. Job costing reports
4. Profitability analysis

---

## 5. Custom DocTypes Development

### 5.1 Site Inspection DocType

```python
# Create via: Customize → DocType → New DocType

DocType Name: Site Inspection
Module: EITS App
Is Submittable: Yes
Track Changes: Yes

# Fields Configuration:
Fields = [
    {
        "fieldname": "inspection_id",
        "label": "Inspection ID",
        "fieldtype": "Data",
        "read_only": 1,
        "default": "SI-.####"
    },
    {
        "fieldname": "lead",
        "label": "Lead",
        "fieldtype": "Link",
        "options": "Lead",
        "reqd": 1
    },
    {
        "fieldname": "customer_name",
        "label": "Customer Name",
        "fieldtype": "Data",
        "fetch_from": "lead.lead_name",
        "read_only": 1
    },
    {
        "fieldname": "inspection_date",
        "label": "Inspection Date",
        "fieldtype": "Date",
        "reqd": 1
    },
    {
        "fieldname": "inspection_time",
        "label": "Inspection Time",
        "fieldtype": "Time",
        "reqd": 1
    },
    {
        "fieldname": "inspector",
        "label": "Inspector",
        "fieldtype": "Link",
        "options": "Employee",
        "reqd": 1
    },
    {
        "fieldname": "section_break_1",
        "fieldtype": "Section Break",
        "label": "Property Details"
    },
    {
        "fieldname": "property_address",
        "label": "Property Address",
        "fieldtype": "Text",
        "reqd": 1
    },
    {
        "fieldname": "property_type",
        "label": "Property Type",
        "fieldtype": "Select",
        "options": "Residential\nCommercial\nIndustrial",
        "reqd": 1
    },
    {
        "fieldname": "project_type",
        "label": "Project Type",
        "fieldtype": "Select",
        "options": "Fitouts\nRefurbishment\nRenovation\nRepair\nMaintenance\nInstallation\nConstruction\nTrading",
        "reqd": 1
    },
    {
        "fieldname": "column_break_1",
        "fieldtype": "Column Break"
    },
    {
        "fieldname": "site_accessibility",
        "label": "Site Accessibility",
        "fieldtype": "Text"
    },
    {
        "fieldname": "existing_condition",
        "label": "Existing Structure Condition",
        "fieldtype": "Text"
    },
    {
        "fieldname": "utilities_available",
        "label": "Utilities Available",
        "fieldtype": "Check"
    },
    {
        "fieldname": "section_break_2",
        "fieldtype": "Section Break",
        "label": "Measurements"
    },
    {
        "fieldname": "site_dimensions",
        "label": "Site Dimensions",
        "fieldtype": "Table",
        "options": "Site Dimension"
    },
    {
        "fieldname": "section_break_3",
        "fieldtype": "Section Break",
        "label": "Documentation"
    },
    {
        "fieldname": "site_photos",
        "label": "Site Photos",
        "fieldtype": "Attach Multiple"
    },
    {
        "fieldname": "measurement_sketch",
        "label": "Measurement Sketch",
        "fieldtype": "Attach"
    },
    {
        "fieldname": "inspection_notes",
        "label": "Inspection Notes",
        "fieldtype": "Text Editor"
    },
    {
        "fieldname": "section_break_4",
        "fieldtype": "Section Break",
        "label": "Requirements Assessment"
    },
    {
        "fieldname": "job_categories_required",
        "label": "Job Categories Required",
        "fieldtype": "Table",
        "options": "Job Category Requirement"
    },
    {
        "fieldname": "estimated_duration",
        "label": "Estimated Duration (Days)",
        "fieldtype": "Int"
    },
    {
        "fieldname": "budget_range",
        "label": "Budget Range",
        "fieldtype": "Select",
        "options": "Under 10,000\n10,000 - 50,000\n50,000 - 100,000\n100,000 - 500,000\nAbove 500,000"
    },
    {
        "fieldname": "section_break_5",
        "fieldtype": "Section Break",
        "label": "Status"
    },
    {
        "fieldname": "inspection_status",
        "label": "Inspection Status",
        "fieldtype": "Select",
        "options": "Scheduled\nCompleted\nRescheduled\nCancelled",
        "default": "Scheduled"
    },
    {
        "fieldname": "followup_required",
        "label": "Follow-up Required",
        "fieldtype": "Check"
    },
    {
        "fieldname": "next_action",
        "label": "Next Action",
        "fieldtype": "Text"
    }
]
```

### 5.2 Job Estimation DocType

```python
# Create Job Estimation DocType

DocType Name: Job Estimation
Module: EITS App
Is Submittable: Yes
Track Changes: Yes

# Key Fields:
Fields = [
    {
        "fieldname": "estimation_id",
        "label": "Estimation ID",
        "fieldtype": "Data",
        "read_only": 1,
        "default": "EST-.####"
    },
    {
        "fieldname": "site_inspection",
        "label": "Site Inspection",
        "fieldtype": "Link",
        "options": "Site Inspection",
        "reqd": 1
    },
    {
        "fieldname": "customer",
        "label": "Customer",
        "fieldtype": "Link",
        "options": "Customer",
        "fetch_from": "site_inspection.lead.customer"
    },
    {
        "fieldname": "estimation_date",
        "label": "Estimation Date",
        "fieldtype": "Date",
        "default": "Today",
        "reqd": 1
    },
    {
        "fieldname": "estimated_by",
        "label": "Estimated By",
        "fieldtype": "Link",
        "options": "Employee",
        "reqd": 1
    },
    {
        "fieldname": "section_break_1",
        "fieldtype": "Section Break",
        "label": "Job Categories"
    },
    {
        "fieldname": "job_categories",
        "label": "Job Categories",
        "fieldtype": "Table",
        "options": "Job Category Detail"
    },
    {
        "fieldname": "section_break_2",
        "fieldtype": "Section Break",
        "label": "Material Requirements"
    },
    {
        "fieldname": "materials",
        "label": "Materials",
        "fieldtype": "Table",
        "options": "Material Estimation"
    },
    {
        "fieldname": "material_total",
        "label": "Material Total",
        "fieldtype": "Currency",
        "read_only": 1
    },
    {
        "fieldname": "section_break_3",
        "fieldtype": "Section Break",
        "label": "Manpower Requirements"
    },
    {
        "fieldname": "manpower",
        "label": "Manpower",
        "fieldtype": "Table",
        "options": "Manpower Estimation"
    },
    {
        "fieldname": "manpower_total",
        "label": "Manpower Total",
        "fieldtype": "Currency",
        "read_only": 1
    },
    {
        "fieldname": "section_break_4",
        "fieldtype": "Section Break",
        "label": "Timeline & Costing"
    },
    {
        "fieldname": "estimated_start_date",
        "label": "Estimated Start Date",
        "fieldtype": "Date"
    },
    {
        "fieldname": "estimated_end_date",
        "label": "Estimated End Date",
        "fieldtype": "Date"
    },
    {
        "fieldname": "total_working_days",
        "label": "Total Working Days",
        "fieldtype": "Int"
    },
    {
        "fieldname": "column_break_1",
        "fieldtype": "Column Break"
    },
    {
        "fieldname": "subtotal",
        "label": "Subtotal",
        "fieldtype": "Currency",
        "read_only": 1
    },
    {
        "fieldname": "overhead_percentage",
        "label": "Overhead %",
        "fieldtype": "Percent",
        "default": "10"
    },
    {
        "fieldname": "overhead_amount",
        "label": "Overhead Amount",
        "fieldtype": "Currency",
        "read_only": 1
    },
    {
        "fieldname": "profit_margin_percentage",
        "label": "Profit Margin %",
        "fieldtype": "Percent",
        "default": "15"
    },
    {
        "fieldname": "profit_amount",
        "label": "Profit Amount",
        "fieldtype": "Currency",
        "read_only": 1
    },
    {
        "fieldname": "total_amount",
        "label": "Total Amount",
        "fieldtype": "Currency",
        "read_only": 1
    },
    {
        "fieldname": "section_break_5",
        "fieldtype": "Section Break",
        "label": "Status"
    },
    {
        "fieldname": "estimation_status",
        "label": "Status",
        "fieldtype": "Select",
        "options": "Draft\nSubmitted\nApproved\nRejected\nRevision Required",
        "default": "Draft"
    },
    {
        "fieldname": "approved_by",
        "label": "Approved By",
        "fieldtype": "Link",
        "options": "User"
    },
    {
        "fieldname": "approval_date",
        "label": "Approval Date",
        "fieldtype": "Date"
    },
    {
        "fieldname": "remarks",
        "label": "Remarks",
        "fieldtype": "Text Editor"
    }
]
```

### 5.3 Child Table DocTypes

#### Site Dimension Child Table

```python
DocType Name: Site Dimension
Is Child Table: Yes
Module: EITS App

Fields = [
    {
        "fieldname": "area_name",
        "label": "Area Name",
        "fieldtype": "Data",
        "in_list_view": 1
    },
    {
        "fieldname": "length",
        "label": "Length (m)",
        "fieldtype": "Float",
        "in_list_view": 1
    },
    {
        "fieldname": "width",
        "label": "Width (m)",
        "fieldtype": "Float",
        "in_list_view": 1
    },
    {
        "fieldname": "height",
        "label": "Height (m)",
        "fieldtype": "Float",
        "in_list_view": 1
    },
    {
        "fieldname": "area",
        "label": "Area (m²)",
        "fieldtype": "Float",
        "read_only": 1,
        "in_list_view": 1
    }
]
```

#### Job Category Requirement Child Table

```python
DocType Name: Job Category Requirement
Is Child Table: Yes
Module: EITS App

Fields = [
    {
        "fieldname": "job_category",
        "label": "Job Category",
        "fieldtype": "Select",
        "options": "Furnitures & Fixtures\nEquipments\nElectrical\nAC, Refrigeration, Heating & Cooling Units\nPainting & Decorating\nSanitary, Plumbing, Toilets & Washroom",
        "in_list_view": 1
    },
    {
        "fieldname": "sub_category",
        "label": "Sub Category",
        "fieldtype": "Data",
        "in_list_view": 1
    },
    {
        "fieldname": "department",
        "label": "Department",
        "fieldtype": "Data",
        "in_list_view": 1
    },
    {
        "fieldname": "priority",
        "label": "Priority",
        "fieldtype": "Select",
        "options": "High\nMedium\nLow",
        "in_list_view": 1
    },
    {
        "fieldname": "estimated_hours",
        "label": "Estimated Hours",
        "fieldtype": "Float"
    },
    {
        "fieldname": "notes",
        "label": "Notes",
        "fieldtype": "Text"
    }
]
```

---

## 6. Workflow Configuration

### 6.1 Lead to Project Workflow

```python
# Workflow States:
States = [
    "Lead Received",
    "Site Inspection Scheduled",
    "Site Inspected",
    "Estimation In Progress",
    "Estimation Completed",
    "Quotation Sent",
    "Under Negotiation",
    "Contract Signed",
    "Project Assigned",
    "Project Completed",
    "Invoiced",
    "Payment Received",
    "Closed"
]

# Workflow Transitions:
Transitions = [
    {
        "from": "Lead Received",
        "to": "Site Inspection Scheduled",
        "action": "Schedule Inspection",
        "allowed": ["Sales User", "Sales Manager"]
    },
    {
        "from": "Site Inspection Scheduled",
        "to": "Site Inspected",
        "action": "Complete Inspection",
        "allowed": ["Site Inspector"]
    },
    {
        "from": "Site Inspected",
        "to": "Estimation In Progress",
        "action": "Start Estimation",
        "allowed": ["Technical Specialist"]
    }
    # ... Continue for all transitions
]
```

### 6.2 User Roles and Permissions

```python
# Custom Roles for EITS:
Roles = [
    "EITS Sales Representative",
    "EITS Site Inspector",
    "EITS Technical Specialist",
    "EITS Project Manager",
    "EITS Operations Manager",
    "EITS Finance Manager"
]

# Permission Configuration:
Permissions = {
    "Site Inspection": {
        "EITS Sales Representative": ["read", "write", "create"],
        "EITS Site Inspector": ["read", "write", "submit"],
        "EITS Technical Specialist": ["read"],
        "EITS Project Manager": ["read"]
    },
    "Job Estimation": {
        "EITS Technical Specialist": ["read", "write", "create", "submit"],
        "EITS Operations Manager": ["read", "write", "approve"],
        "EITS Project Manager": ["read"]
    }
}
```

---

## 7. Development Commands & Scripts

### 7.1 Essential Bench Commands

```bash
# Development workflow commands:

# Create new DocType
bench --site eits.local console
>>> frappe.new_doc("DocType")

# Migrate after changes
bench --site eits.local migrate

# Clear cache
bench --site eits.local clear-cache

# Restart after code changes
bench restart

# Install/Update custom app
bench --site eits.local install-app eits_app
bench --site eits.local migrate

# Backup site
bench --site eits.local backup

# Create fixtures (for deployment)
bench --site eits.local export-fixtures
```

### 7.2 Development Best Practices

```python
# Custom Scripts Location:
# eits_app/eits_app/custom_scripts/

# Client Script Example (site_inspection.js):
frappe.ui.form.on('Site Inspection', {
    refresh: function(frm) {
        if (frm.doc.docstatus === 1 && frm.doc.inspection_status === 'Completed') {
            frm.add_custom_button(__('Create Estimation'), function() {
                frappe.new_doc('Job Estimation', {
                    site_inspection: frm.doc.name
                });
            });
        }
    },

    // Auto-calculate area when dimensions change
    site_dimensions_on_form_rendered: function(frm) {
        frm.fields_dict.site_dimensions.grid.get_field('length').df.onchange = function() {
            calculate_area(frm);
        };
    }
});

function calculate_area(frm) {
    frm.doc.site_dimensions.forEach(function(row) {
        if (row.length && row.width) {
            row.area = row.length * row.width;
        }
    });
    frm.refresh_field('site_dimensions');
}

# Server Script Example (job_estimation.py):
import frappe
from frappe.model.document import Document

class JobEstimation(Document):
    def validate(self):
        self.calculate_totals()
        self.validate_dates()

    def calculate_totals(self):
        material_total = sum([d.amount for d in self.materials])
        manpower_total = sum([d.amount for d in self.manpower])

        self.material_total = material_total
        self.manpower_total = manpower_total
        self.subtotal = material_total + manpower_total

        self.overhead_amount = self.subtotal * (self.overhead_percentage / 100)
        self.profit_amount = (self.subtotal + self.overhead_amount) * (self.profit_margin_percentage / 100)
        self.total_amount = self.subtotal + self.overhead_amount + self.profit_amount

    def validate_dates(self):
        if self.estimated_start_date and self.estimated_end_date:
            if self.estimated_start_date > self.estimated_end_date:
                frappe.throw("Start date cannot be after end date")
```

---

## 8. Testing & Quality Assurance

### 8.1 Unit Testing

```python
# Create test files in:
# eits_app/eits_app/tests/

# test_site_inspection.py
import frappe
import unittest

class TestSiteInspection(unittest.TestCase):
    def setUp(self):
        self.lead = frappe.get_doc({
            "doctype": "Lead",
            "lead_name": "Test Customer",
            "email_id": "test@customer.com"
        }).insert()

    def test_site_inspection_creation(self):
        inspection = frappe.get_doc({
            "doctype": "Site Inspection",
            "lead": self.lead.name,
            "inspection_date": "2024-01-15",
            "inspection_time": "10:00:00",
            "property_type": "Residential",
            "project_type": "Renovation"
        })
        inspection.insert()

        self.assertEqual(inspection.customer_name, "Test Customer")
        self.assertEqual(inspection.inspection_status, "Scheduled")

    def tearDown(self):
        frappe.delete_doc("Lead", self.lead.name)
```

### 8.2 User Acceptance Testing Checklist

```markdown
## Phase 1 Testing Checklist

### Lead Management

- [ ] Lead creation with EITS-specific fields
- [ ] Lead assignment to sales representatives
- [ ] Lead status progression
- [ ] Customer contact information capture

### Site Inspection

- [ ] Inspection scheduling from lead
- [ ] Site measurement documentation
- [ ] Photo upload functionality
- [ ] Inspector assignment
- [ ] Inspection completion workflow

### Job Estimation

- [ ] Estimation creation from site inspection
- [ ] Material requirements calculation
- [ ] Manpower estimation
- [ ] Cost calculation with margins
- [ ] Approval workflow

### Integration Testing

- [ ] Lead to Site Inspection flow
- [ ] Site Inspection to Job Estimation flow
- [ ] Data consistency across documents
- [ ] User permission enforcement
```

---

## 9. Deployment Preparation

### 9.1 Production Setup Checklist

```bash
# Production deployment steps:

# 1. Create production site
bench new-site eits.prod --admin-password [secure_password]

# 2. Install apps
bench --site eits.prod install-app erpnext
bench --site eits.prod install-app eits_app

# 3. Import fixtures
bench --site eits.prod import-fixtures

# 4. Setup SSL
bench setup nginx
sudo service nginx reload

# 5. Setup supervisor for production
bench setup supervisor
sudo service supervisor reload

# 6. Setup scheduled jobs
bench setup production [user]
```

### 9.2 Backup Strategy

```bash
# Daily automated backups
bench --site eits.prod backup --with-files
bench --site eits.prod backup-all-sites

# Configure cron for automated backups
# Add to crontab:
0 2 * * * cd /home/frappe/eits-bench && bench --site eits.prod backup --with-files
```

---

## 10. Training & Documentation

### 10.1 User Training Plan

**Week 1: System Overview**

- ERPNext navigation and basic concepts
- EITS workflow introduction
- User roles and permissions

**Week 2: Lead Management**

- Lead creation and qualification
- Site inspection scheduling
- Customer communication tracking

**Week 3: Estimation Process**

- Site inspection documentation
- Job estimation creation
- Material and manpower planning

**Week 4: Advanced Features**

- Reporting and analytics
- Custom field usage
- Workflow management

### 10.2 Support Documentation

Create user manuals for:

- EITS Sales Representative Guide
- Site Inspector Manual
- Technical Specialist Handbook
- Manager Dashboard Guide

---

## Conclusion

This documentation provides a comprehensive roadmap for implementing EITS-specific ERPNext customizations. The phased approach ensures systematic development and testing, while the detailed technical specifications enable proper implementation of business requirements.

**Next Steps:**

1. Complete Phase 1 development and testing
2. Conduct user training for Phase 1 features
3. Gather feedback and refine before Phase 2
4. Continue with subsequent phases based on business priorities

**Support Contacts:**

- Technical Support: [technical-support@eits.local]
- Training Queries: [training@eits.local]
- Business Process: [process@eits.local]
