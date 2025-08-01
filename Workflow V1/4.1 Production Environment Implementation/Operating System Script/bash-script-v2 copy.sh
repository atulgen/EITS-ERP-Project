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
DB_HOST="ep-mute-fog-a1ksi8qu-pooler.ap-southeast-1.aws.neon.tech"      # Change to your Neon endpoint
DB_PORT="5432"                          # Neon default port
DB_NAME="neondb"                  # Neon database name
DB_USER="neondb_owner"                  # Neon database user
DB_PASS="npg_ylExdov39cnh"              # Neon database password
SITE_NAME="erp.eitsdubai.com"           # Your domain
ADMIN_PASS="my4v10lMSyUJD1f@YwzGkJ" # Change this!

# --- Phase 1: System Setup (Root) ---
echo -e "${GREEN}[1/4] Updating system and installing dependencies...${NC}"
apt-get update
apt-get upgrade -y
apt-get install -y \
    python3.10 \   
    pkg-config \
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