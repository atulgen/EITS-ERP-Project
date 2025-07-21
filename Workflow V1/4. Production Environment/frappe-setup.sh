#!/bin/bash
# Script 2: post_frappe_setup.sh
# To be run as the 'frappe' user after Frappe is installed

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Check if NOT running as root
if [ "$(id -u)" -eq 0 ]; then
    echo -e "${RED}This script must NOT be run as root. Run as 'frappe' user.${NC}" >&2
    exit 1
fi

# Configuration variables - CHANGE THESE!
DB_ROOT_PASSWORD="your_mariadb_root_password"
SITE_NAME="yoursite.com"
ADMIN_PASSWORD="secure_admin_password"
APPS_TO_INSTALL="erpnext payments"  # Space-separated list of apps to install
BENCH_NAME="frappe-bench"
BENCH_DIR="/home/frappe/$BENCH_NAME"

# Add to hosts file (requires sudo)
echo -e "${YELLOW}Adding site to hosts file...${NC}"
echo "127.0.0.1 $SITE_NAME" | sudo tee -a /etc/hosts

# Initialize bench (if not already exists)
if [ ! -d "$BENCH_DIR" ]; then
    echo -e "${YELLOW}Initializing bench...${NC}"
    bench init $BENCH_NAME --frappe-branch version-14
fi

cd $BENCH_DIR

# Create new site
echo -e "${YELLOW}Creating new site...${NC}"
bench new-site $SITE_NAME \
    --mariadb-root-password "$DB_ROOT_PASSWORD" \
    --admin-password "$ADMIN_PASSWORD" \
    --db-name "frappe_${SITE_NAME//./_}" \
    --db-password "frappe_password"  # Change if you want different DB credentials

# Get and install apps
for APP in $APPS_TO_INSTALL; do
    echo -e "${YELLOW}Installing $APP...${NC}"
    bench get-app $APP
    bench --site $SITE_NAME install-app $APP
done

# Setup production
echo -e "${YELLOW}Setting up production environment...${NC}"
bench setup production frappe --yes

# Setup nginx
echo -e "${YELLOW}Configuring nginx...${NC}"
sudo bench setup nginx

# Setup supervisor
echo -e "${YELLOW}Configuring supervisor...${NC}"
sudo bench setup supervisor

# Enable scheduler
echo -e "${YELLOW}Enabling scheduler...${NC}"
bench --site $SITE_NAME enable-scheduler

# Start all services
echo -e "${YELLOW}Starting services...${NC}"
sudo supervisorctl restart all
sudo systemctl restart nginx

echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${YELLOW}Site URL: http://$SITE_NAME${NC}"
echo -e "${YELLOW}Admin password: $ADMIN_PASSWORD${NC}"
echo -e "${YELLOW}Management commands:${NC}"
echo "  - Start bench: bench start"
echo "  - Stop bench: bench stop"
echo "  - View logs: bench --site $SITE_NAME logs"