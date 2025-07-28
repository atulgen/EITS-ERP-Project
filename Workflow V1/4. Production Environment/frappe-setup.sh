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
SITE_NAME="eitsdubai.com"
ADMIN_PASSWORD="secure_admin_password"
APPS_TO_INSTALL="erpnext hrms eits_app"  # Added eits_app
BENCH_NAME="frappe-bench"
BENCH_DIR="/home/frappe/$BENCH_NAME"

# Remote Database Configuration - CHANGE THESE!
REMOTE_DB_HOST="remote-db-host"
REMOTE_DB_PORT="3306"
REMOTE_DB_USER="frappe_remote_user"
REMOTE_DB_PASS="remote_db_password"

# Add to hosts file (requires sudo)
echo -e "${YELLOW}Adding site to hosts file...${NC}"
echo "127.0.0.1 $SITE_NAME" | sudo tee -a /etc/hosts

# Initialize bench (if not already exists)
if [ ! -d "$BENCH_DIR" ]; then
    echo -e "${YELLOW}Initializing bench for ERPNext v15...${NC}"
    bench init $BENCH_NAME --frappe-branch version-15
fi

cd $BENCH_DIR

# Get apps
echo -e "${YELLOW}Getting applications...${NC}"
bench get-app erpnext --branch version-15
bench get-app hrms --branch version-15
bench get-app https://github.com/atulgen/eits_app  # Cloning your custom app

# Create new site with remote database configuration
echo -e "${YELLOW}Creating new site with remote database...${NC}"
bench new-site $SITE_NAME \
    --mariadb-root-username "$REMOTE_DB_USER" \
    --mariadb-root-password "$REMOTE_DB_PASS" \
    --admin-password "$ADMIN_PASSWORD" \
    --db-host "$REMOTE_DB_HOST" \
    --db-port "$REMOTE_DB_PORT" \
    --db-name "frappe_${SITE_NAME//./_}" \
    --db-password "$REMOTE_DB_PASS" \
    --install-app erpnext \
    --install-app hrms \
    --install-app eits_app

# Alternative installation method if the above doesn't work
for APP in $APPS_TO_INSTALL; do
    echo -e "${YELLOW}Installing $APP...${NC}"
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

# Create backup directory and schedule regular backups
echo -e "${YELLOW}Setting up backup schedule...${NC}"
mkdir -p ~/backups
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/bin/bash $BENCH_DIR/env/bin/bench --site $SITE_NAME backup --with-files --compress") | crontab -

echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${YELLOW}Site URL: http://$SITE_NAME${NC}"
echo -e "${YELLOW}Admin password: $ADMIN_PASSWORD${NC}"
echo -e "${YELLOW}Remote Database: ${REMOTE_DB_HOST}:${REMOTE_DB_PORT}${NC}"
echo -e "${YELLOW}Management commands:${NC}"
echo "  - Start bench: bench start"
echo "  - Stop bench: bench stop"
echo "  - View logs: bench --site $SITE_NAME logs"
echo "  - Backup: bench --site $SITE_NAME backup"