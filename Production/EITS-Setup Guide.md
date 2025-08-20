# ERP System Setup Guide

## Overview
This guide provides step-by-step instructions for setting up the ERP system with ERPNext, HRMS, and custom applications.

## Prerequisites
- Bench framework installed and configured
- Administrative access to the server
- GitHub access for custom app installation

## 1. Environment Setup

### 1.1 Bench Configuration
- Ensure Bench is properly installed and operational
- Verify site configuration and permissions

### 1.2 Site Creation
- **Site URL**: `eits.thebigocommunity.org`
- Configure site-specific settings and database connections

## 2. Application Installation

### 2.1 Core Applications
Install the following applications in sequence:

1. **ERPNext**
   - Install the main ERP application
   - Configure basic settings and permissions

2. **HRMS (Human Resource Management System)**
   - Install HRMS module for employee management
   - Configure HR-related workflows

3. **Custom Eits Application**
   - Install custom application from GitHub repository
   - Command: `bench get-app https://github.com/atulgen/eits_app`
   - Follow installation prompts and dependency resolution

## 3. System Configuration

### 3.1 CORS (Cross-Origin Resource Sharing) Configuration
- Locate and modify configuration files
- Enable CORS for frontend-backend communication
- Configure allowed origins and methods
- Test CORS functionality

### 3.2 Security Settings
- Configure authentication methods
- Set up user permissions and roles
- Implement security protocols

## 4. Data Setup and Configuration

### 4.1 Lead Management
- Configure lead capture forms
- Set up lead assignment rules
- Define lead status workflows
- **Job Type**: Configure available job categories
   - Doctype data imported
- **Project Urgency**: Set urgency levels and priorities
   - Doctype data imported
- **Estimate Budget**: Configure budget templates and approval workflows
  - Doctype data not imported


### 4.3 Geographic Data (UAE-specific)
Configure UAE location hierarchy:

- **UAE Emirate**: Configure emirate listings
- **UAE City**: Set up city databases
- **UAE Area**: Configure area/district mappings
   - Doctype data imported for all 3


### 4.4 User Management

- **Department**: Configure organizational departments
- **Designation**: Set up job titles and positions
- **Roles** : Roles 
   - TUpdate the Roles
      - Create manually
   - Role Profile
      From data   
- **Employee Data**: Import or configure employee information
   - **Users**: Create and configure user accounts
   - **Employee**: Set up employee profiles and records
      - Uploading users
         - User setting will be created
         - Roles are uploaded


### 4.5 Inventory Management
- **Item Group**: Set up item categorization
   - Doctype data imported
- **UOM (Unit of Measure)**: Configure measurement units
   - Doctype data imported
- **Item**: Configure product/service items
   - Doctype data imported


## 5. Email Configuration

### 5.1 Email Server Setup
- Configure SMTP settings
- Set up email templates
- Test email functionality
- Configure automated notifications

### 5.2 Integration Testing
- Test email workflows
- Verify notification systems
- Configure email routing rules



---


### Forms 

- Sales 
- Site Inspection
- Supervisor
- Amount



## 6. System Access Points

### 6.1 ERP Backend Access
- **URL**: `https://eits.thebigocommunity.org`
- Administrative and user access portal
- Full ERP functionality available

### 6.2 Frontend Application
- **URL**: `https://eits-erp.vercel.app/login`
- User-friendly interface for common operations
- Mobile-responsive design

## 7. Post-Installation Tasks

### 7.1 System Testing
- Conduct comprehensive system testing
- Verify all modules are functioning correctly
- Test integration between applications

### 7.2 User Training
- Prepare user documentation
- Conduct training sessions
- Set up support procedures

### 7.3 Backup and Maintenance
- Configure automated backups
- Set up monitoring and alerting
- Establish maintenance schedules

## 8. Troubleshooting

### 8.1 Common Issues
- Installation errors and resolutions
- CORS configuration problems
- Database connection issues

### 8.2 Support Resources
- Documentation references
- Community forums
- Technical support contacts

## Notes
- Ensure all applications are compatible with the current Bench version
- Regular updates and security patches should be applied
- Monitor system performance and optimize as needed
- Maintain regular backups of all data and configurations