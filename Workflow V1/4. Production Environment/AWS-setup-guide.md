# **Automated AWS ERPNext Deployment Guide (Bash Script Driven)**

This guide provides a **fully automated** approach to deploying ERPNext v15 on AWS EC2 using the bash scripts you've provided. The entire setup will run automatically during EC2 initialization.

---

## **Phase 1: Launch EC2 with User Data Script**

### **1. EC2 Configuration**

- **AMI**: Ubuntu 22.04 LTS
- **Instance Type**: `t3.medium` (2 vCPU, 4GB RAM)
- **Storage**: 30GB SSD (gp3)
- **Security Group**: Allow HTTP(80), HTTPS(443), SSH(22)

### **2. Paste User Data Script**

When launching the EC2 instance, paste this **User Data** script (combines your two scripts into one automated workflow):

```bash
#!/bin/bash

# ----- AWS EC2 User Data Script for ERPNext v15 -----
# Automatically installs:
# - ERPNext v15 + HRMS + eits_app
# - Configures Neon PostgreSQL
# - Sets up production environment
# - Configures domain erp.eitsdubai.com

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# --- Configuration Variables ---
DB_HOST="your-neon-host.neon.tech"      # Change to your Neon endpoint
DB_PORT="5432"                          # Neon default port
DB_NAME="your-db-name"                  # Neon database name
DB_USER="your-db-user"                  # Neon database user
DB_PASS="your-db-password"              # Neon database password
SITE_NAME="erp.eitsdubai.com"           # Your domain
ADMIN_PASS="your-secure-admin-password" # Change this!

# --- Phase 1: System Setup (Root) ---
echo -e "${GREEN}[1/4] Updating system and installing dependencies...${NC}"
apt-get update
apt-get upgrade -y
apt-get install -y \
    python3.10 \
    python3.10-dev \
    python3.10-venv \
    python3-pip \
    virtualenv \
    redis-server \
    nodejs \
    yarn \
    git \
    nginx \
    supervisor \
    cron \
    libffi-dev \
    libssl-dev \
    libpq-dev \
    wkhtmltopdf

# --- Phase 2: Create Frappe User ---
echo -e "${GREEN}[2/4] Creating 'frappe' user...${NC}"
if ! id -u frappe >/dev/null 2>&1; then
    useradd -m -s /bin/bash frappe
    usermod -aG sudo frappe
    echo "frappe ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers.d/frappe
    chmod 440 /etc/sudoers.d/frappe
fi

# --- Phase 3: Run as Frappe User ---
echo -e "${GREEN}[3/4] Running Frappe setup as 'frappe' user...${NC}"
sudo -u frappe -i bash << EOF
    # Install Bench
    pip3 install --user pip==23.0.1
    pip3 install --user frappe-bench

    # Initialize Bench
    bench init --frappe-branch version-15 frappe-bench
    cd frappe-bench

    # Configure Neon DB
    bench set-config -g db_host "$DB_HOST"
    bench set-config -g db_port "$DB_PORT"
    bench set-config -g db_name "$DB_NAME"
    bench set-config -g db_password "$DB_PASS"

    # Get Apps
    bench get-app erpnext --branch version-15
    bench get-app hrms --branch version-15
    bench get-app https://github.com/atulgen/eits_app

    # Create Site
    bench new-site "$SITE_NAME" \
        --db-type postgres \
        --admin-password "$ADMIN_PASS" \
        --install-app erpnext \
        --install-app hrms \
        --install-app eits_app

    # Production Setup
    sudo bench setup nginx
    sudo bench setup supervisor
    bench --site "$SITE_NAME" enable-scheduler
EOF

# --- Phase 4: Finalize (Root) ---
echo -e "${GREEN}[4/4] Starting services...${NC}"
sudo supervisorctl restart all
sudo systemctl restart nginx

# Add to hosts file
echo "127.0.0.1 $SITE_NAME" >> /etc/hosts

# --- Completion Message ---
echo -e "${GREEN}✅ ERPNext deployment complete!${NC}"
echo -e "${YELLOW}Access your instance:${NC}"
echo -e "URL: https://$SITE_NAME"
echo -e "Admin Password: $ADMIN_PASS"
echo -e "${YELLOW}To monitor logs:${NC}"
echo -e "sudo -u frappe -i bench --site $SITE_NAME logs"
```

---

## **Phase 2: Post-Deployment Steps**

### **1. Configure DNS (erp.eitsdubai.com)**

- Go to your DNS provider (Cloudflare/GoDaddy)
- Add an **A record** pointing to your EC2 public IP:
  ```
  erp.eitsdubai.com -> <EC2_PUBLIC_IP>
  ```

### **2. Set Up SSL (Let's Encrypt)**

After DNS propagates (may take 5-10 mins), run:

```bash
sudo -u frappe -i bench setup lets-encrypt erp.eitsdubai.com
```

### **3. Verify Installation**

```bash
# Check site status
curl -I https://erp.eitsdubai.com

# Check background jobs
sudo -u frappe -i bench --site erp.eitsdubai.com doctor
```

---

## **Key Features of This Setup**

1. **Fully Automated** - Runs everything during EC2 launch
2. **Neon PostgreSQL** - Pre-configured for remote DB
3. **Custom App Included** - `eits_app` installed automatically
4. **Production-Ready** - Nginx, Supervisor, SSL-ready
5. **Domain Pre-Configured** - `erp.eitsdubai.com` set up

---

## **Troubleshooting**

If the instance doesn't initialize properly:

1. Check EC2 **System Log** (AWS Console > EC2 > Instance > Actions > Monitor and Troubleshoot)
2. Examine logs:
   ```bash
   cat /var/log/cloud-init-output.log
   ```
3. Re-run manually as `frappe` user if needed:
   ```bash
   sudo su - frappe
   cd frappe-bench
   bench start
   ```

---

## **Maintenance Commands**

| Task            | Command                                 |
| --------------- | --------------------------------------- |
| Restart ERPNext | `sudo supervisorctl restart all`        |
| Backup Site     | `bench --site erp.eitsdubai.com backup` |
| Update Apps     | `bench update --patch`                  |
| View Logs       | `bench --site erp.eitsdubai.com logs`   |

This approach ensures your EC2 is **fully pre-configured** on first boot. Just launch with the User Data script and wait ~15-20 minutes for complete setup! 🚀
