## CRM Application

- [Docs](https://docs.frappe.io/crm/introduction)
- [Installation](https://github.com/frappe/bench#installation)
- [The Flow](#the-flow)

---

The Sales Representative will initiate the process.

## Lead

![alt text](image.png)

![](./crm.png)

### Sources:

- Existing Customer
- Advertisements

---

There are 2 ways to implement this.

## CRM within ERPNext

- [Video reference](https://invidious.f5.si/watch?v=vaPN_0fEByk)

### Implementation:

#### Containerised

- [Using Frappe Docker](https://github.com/frappe/erpnext?tab=readme-ov-file#docker)

```bash
git clone https://github.com/frappe/frappe_docker
cd frappe_docker
docker compose -f pwd.yml up -d
```

After a couple of minutes, site should be accessible on your localhost port: 8080. Use below default login credentials to access the site.

- Username: Administrator
- Password: admin

Check status:

```bash
docker compose -f pwd.yml logs -f create-site
```

---

> Proceeding with ERPNext CRM

First let's make sure that we have our
[Users and Roles](../Roles/Users%20and%20Role%20Defination/readme.md) defined correctly.

### The Flow

![alt text](image-1.png)

![alt text](image-2.png)

![alt text](image-3.png)

![alt text](image-4.png)

![alt text](image-5.png)

![alt text](image-6.png)

![alt text](image-7.png)

#### Manual

- Directly installing into OS

## CRM standalone app
