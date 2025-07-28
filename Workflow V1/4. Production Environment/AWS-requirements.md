Certainly! Here are the **minimum requirements** for installing **ERPNext** on an **AWS EC2 instance**:

### **1. Hardware Requirements**

| Component   | Minimum Requirement | Recommended for Production |
| ----------- | ------------------- | -------------------------- |
| **vCPUs**   | 2 cores             | 4 cores or more            |
| **RAM**     | 4 GB                | 8 GB or more               |
| **Storage** | 30 GB (SSD)         | 100 GB (SSD) or more       |

### **2. Operating System**

- **Ubuntu 22.04 LTS** (Recommended)  
  _(ERPNext supports Ubuntu 20.04 as well, but 22.04 is preferred for newer setups)_
- **Debian 11** (Alternative option)

### **3. Software Dependencies**

- **MariaDB 10.6+** (Database)
- **Redis** (Caching & Background Jobs)
- **Node.js 16+** (Frontend & Backend)
- **Python 3.10+** (ERPNext is Python-based)
- **Nginx** (Web Server & Proxy)
- **Supervisor** (Process Management)
- **wkhtmltopdf** (For PDF generation)

### **4. Network Requirements**

- **Inbound Ports Open:**
  - **80 (HTTP)**
  - **443 (HTTPS)** _(Recommended for production)_
  - **22 (SSH)** _(For administration)_

### **5. AWS EC2 Instance Types**

| Use Case       | Instance Type | Notes                         |
| -------------- | ------------- | ----------------------------- |
| **Testing**    | `t3.medium`   | 2 vCPUs, 4 GB RAM             |
| **Production** | `t3.large`    | 4 vCPUs, 8 GB RAM (or higher) |
| **High Load**  | `m6i.large`   | For larger deployments        |



