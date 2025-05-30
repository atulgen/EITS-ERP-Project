
#### Customer Form

- SNo: 1

- DocType: Customer
- Module: Selling

- URL: http://eits.local:8001/app/customer

![Customer Form](image-1.png)

###### Attributes:

- Customer name
- Address and contact
- Customer Group
  - Commercial
  - Individual
  - Govt
  - NGO
- Source
  - From Lead
  - From Opportunity
  - From Prospect?
- Billing Currency
- Bank Account
- Default Price List

- Relationships
  - Inquiry,
  - Site Inspection,
  - Quotation,
  - Jobs,
  - Followup,
  - Approval,
  - Invoice,
  - Collection

![Relationships](image-5.png)

- Remarks
  - Customer can be created
  - Except Address, all the details about customer can be added.

---

---

#### Supplier Form

- SNo: 2

- DocType: Supplier
- Module: Buying

![Supplier form](image-2.png)

##### Attributes:

- Supplier Name
- Country
- Supplier Group
  - Distributer
  - Electrical
  - Hardware
  - Local
- Supplier Type
- Is Transporter
- Defaults
  - Billing Currency
  - Default Company Bank Account
  - Price List

![More Supplier details](image-3.png)

- Relationships
  - Inquiry,
  - Site Inspection,
  - Quotation,
  - Jobs,
  - Followup,
  - Approval,
  - Invoice,
  - Collection

![Relationship in erp](image-4.png)

---

---

#### Material Category Form

- SNo: 3
- DocType: Item Group
- Module: Stock

![Item group](image-6.png)

![All Item groups](image-7.png)

- Relationships

  - Material Group,
  - Issue,
  - Receipt,
  - currency,
  - Unit,
  - Dimension

- Remarks:
  - Material category in requirement can be mapped to Item Group
  - Material to be mapped with Item.
  - In Relationships "Material Group" is to be seems as in place of Item group

---

---


#### Material Form

- SNo: 4
- DocType: Item
- Module: Stock

![Item](image-8.png)


- Relationships

![alt text](image-9.png)

- Remarks:
  - Material is to be mapped with Item in ERPNext.

#### Unit of Material Form

- SNo: 5
- DocType: UOM
  - Unit Of Measurement

![alt text](image-10.png)

