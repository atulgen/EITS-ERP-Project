

## Two Different CRM Systems

### 1. ERPNext Built-in CRM Module
- **Location**: Inside ERPNext (what you see in the left sidebar under "CRM")
- **Purpose**: Traditional ERP CRM functionality
- **Features**: Lead → Opportunity → Quotation → Sales Order workflow
- **Integration**: Fully integrated with ERPNext's Accounting, Stock, Projects modules
- **Data**: Stored in ERPNext database tables

### 2. Frappe CRM (Standalone App)
- **Location**: Separate application (the purple CRM icon in your app switcher)
- **Purpose**: Modern, dedicated CRM platform
- **Features**: More advanced CRM features, better UI/UX, modern workflows
- **Integration**: Can integrate with ERPNext but operates independently
- **Data**: Stored in separate CRM database tables

## Why Leads Don't Show Up Between Them

The two systems have **completely separate databases** for their CRM data:

- **ERPNext CRM**: Uses `tabLead`, `tabOpportunity`, etc.
- **Frappe CRM**: Uses `tabCRM Lead`, `tabCRM Deal`, etc.

They don't automatically sync because they're designed as separate systems.

## Recommended Approach for EITS

Based on your requirements, I recommend using **Frappe CRM (standalone)** for the following reasons:

### Why Frappe CRM is Better for EITS:
1. **Modern Interface**: Better user experience for sales teams
2. **Advanced Features**: Better lead management, email integration, activity tracking
3. **Flexibility**: More customizable for your specific workflows
4. **Focus**: Dedicated CRM features without ERP complexity
5. **Mobile-Friendly**: Better mobile experience for field teams

### Integration Strategy:
```
Frappe CRM → Custom Integration → ERPNext
    ↓              ↓                ↓
  Leads      →   Data Bridge   →   Customers
  Deals      →   Sync Logic    →   Quotations
Activities   →   Workflow      →   Projects
```

## Updated Implementation Plan

## Next Steps for Your Implementation:

### 1. Disable ERPNext CRM Module
```bash
# Hide ERPNext CRM from users to avoid confusion
bench --site your-site set-config hide_modules '["CRM"]'
```

### 2. Focus on Frappe CRM Development
- Use the standalone Frappe CRM for all lead management
- Customize it for EITS workflows
- Build your custom features there

### 3. Create Integration Bridge
- Custom app to sync data between Frappe CRM and ERPNext
- Map: CRM Leads → ERPNext Customers
- Map: CRM Deals → ERPNext Quotations
- Map: CRM Projects → ERPNext Projects

### 4. User Training
- Train sales team on Frappe CRM only
- Train operations team on ERPNext only
- Data flows automatically via integration

## Benefits of This Approach:
- **Clear Separation**: Sales uses CRM, Operations uses ERP
- **Best of Both Worlds**: Modern CRM + Robust ERP
- **No Confusion**: Users see only what they need
- **Scalable**: Each system can be optimized independently

Would you like me to create a detailed guide for setting up the integration between Frappe CRM and ERPNext?