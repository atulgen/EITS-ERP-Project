#!/bin/bash

# Frappe-ERPNext Site Setup Script
# This script initializes frappe bench and creates a new site with ERPNext

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🏗️  Starting Frappe-ERPNext Site Setup..."

# Default values
DEFAULT_SITE_NAME="erp.eitsdubai.com"
DEFAULT_BENCH_DIR="frappe-bench"
DEFAULT_DB_ROOT_PASSWORD="JnSCKGU9xACw4CSsbwkg6fbeoVUK0X"

# Get site name from user
read -p "Enter site name (default: $DEFAULT_SITE_NAME): " SITE_NAME
SITE_NAME=${SITE_NAME:-$DEFAULT_SITE_NAME}

# Get bench directory name
read -p "Enter bench directory name (default: $DEFAULT_BENCH_DIR): " BENCH_DIR
BENCH_DIR=${BENCH_DIR:-$DEFAULT_BENCH_DIR}

# Get database root password
echo
print_status "Database Configuration:"
print_warning "You'll need the MariaDB root password that you set during 'mysql_secure_installation'"
read -s -p "Enter MariaDB root password: " DB_ROOT_PASSWORD
echo

# Get administrator password for the site
echo
print_status "Site Administrator Configuration:"
print_warning "Set a strong password for the site Administrator account"
while true; do
    read -s -p "Enter Administrator password: " ADMIN_PASSWORD
    echo
    read -s -p "Confirm Administrator password: " ADMIN_PASSWORD_CONFIRM
    echo
    
    if [ "$ADMIN_PASSWORD" = "$ADMIN_PASSWORD_CONFIRM" ]; then
        if [ ${#ADMIN_PASSWORD} -lt 8 ]; then
            print_error "Password must be at least 8 characters long"
            continue
        fi
        break
    else
        print_error "Passwords do not match. Please try again."
    fi
done

# Check if bench command exists
if ! command -v bench &> /dev/null; then
    print_error "Bench command not found. Please ensure frappe-bench is installed and in PATH."
    print_status "Try running: source ~/.bashrc"
    exit 1
fi

# Check if directory already exists
if [ -d "$BENCH_DIR" ]; then
    print_warning "Directory $BENCH_DIR already exists!"
    read -p "Do you want to continue and use existing bench? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Exiting..."
        exit 1
    fi
    cd "$BENCH_DIR"
else
    # STEP 13: Initialize frappe bench
    print_status "Initializing Frappe bench with version-15..."
    bench init "$BENCH_DIR" --frappe-branch version-15 --python python3.11
    
    print_success "Frappe bench initialized successfully"
    
    # Change to bench directory
    cd "$BENCH_DIR"
fi

# Check if site already exists
if [ -d "sites/$SITE_NAME" ]; then
    print_warning "Site $SITE_NAME already exists!"
    read -p "Do you want to continue? This will skip site creation. (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Exiting..."
        exit 1
    fi
    SITE_EXISTS=true
else
    SITE_EXISTS=false
fi

# STEP 14: Create a new site
if [ "$SITE_EXISTS" = false ]; then
    print_status "Creating new site: $SITE_NAME"
    
    # Create site with database root password and administrator password
    if [ -n "$DB_ROOT_PASSWORD" ]; then
        print_status "Creating site with database authentication..."
        bench new-site "$SITE_NAME" \
            --db-root-password "$DB_ROOT_PASSWORD" \
            --admin-password "$ADMIN_PASSWORD"
    else
        print_status "Creating site (you may be prompted for database password)..."
        bench new-site "$SITE_NAME" --admin-password "$ADMIN_PASSWORD"
    fi
    
    # Add site to hosts
    bench --site "$SITE_NAME" add-to-hosts
    
    print_success "Site $SITE_NAME created successfully"
    print_success "Administrator password has been set"
fi

# STEP 15: Install ERPNext
print_status "Checking if ERPNext app exists..."

if [ ! -d "apps/erpnext" ]; then
    print_status "Getting ERPNext app (version-15)..."
    bench get-app erpnext --branch version-15
    print_success "ERPNext app downloaded successfully"
else
    print_warning "ERPNext app already exists, skipping download"
fi

# Check if ERPNext is already installed on the site
ERPNEXT_INSTALLED=$(bench --site "$SITE_NAME" list-apps | grep -c "erpnext" || true)

if [ "$ERPNEXT_INSTALLED" -eq 0 ]; then
    print_status "Installing ERPNext on site $SITE_NAME..."
    bench --site "$SITE_NAME" install-app erpnext
    print_success "ERPNext installed on site successfully"
else
    print_warning "ERPNext already installed on site $SITE_NAME"
fi

# STEP 16: Install HRMS
print_status "Checking if HRMS app exists..."

if [ ! -d "apps/hrms" ]; then
    print_status "Getting HRMS app (version-15)..."
    bench get-app hrms --branch version-15
    print_success "HRMS app downloaded successfully"
else
    print_warning "HRMS app already exists, skipping download"
fi

# Check if HRMS is already installed on the site
HRMS_INSTALLED=$(bench --site "$SITE_NAME" list-apps | grep -c "hrms" || true)

if [ "$HRMS_INSTALLED" -eq 0 ]; then
    print_status "Installing HRMS on site $SITE_NAME..."
    bench --site "$SITE_NAME" install-app hrms
    print_success "HRMS installed on site successfully"
else
    print_warning "HRMS already installed on site $SITE_NAME"
fi

# STEP 17: Install EITs Custom App
print_status "Checking if EITs app exists..."

if [ ! -d "apps/eits_app" ]; then
    print_status "Getting EITs custom app from GitHub..."
    bench get-app https://github.com/atulgen/eits_app
    print_success "EITs app downloaded successfully"
else
    print_warning "EITs app already exists, skipping download"
fi

# Check if EITs app is already installed on the site
EITS_INSTALLED=$(bench --site "$SITE_NAME" list-apps | grep -c "eits_app" || true)

if [ "$EITS_INSTALLED" -eq 0 ]; then
    print_status "Installing EITs app on site $SITE_NAME..."
    bench --site "$SITE_NAME" install-app eits_app
    print_success "EITs app installed on site successfully"
else
    print_warning "EITs app already installed on site $SITE_NAME"
fi

# Create a simple start script
print_status "Creating start script..."
cat > start_server.sh << EOF
#!/bin/bash
cd $(pwd)
echo "Starting Frappe development server..."
echo "Site URL: http://$SITE_NAME:8000"
echo "Press Ctrl+C to stop the server"
bench start
EOF

chmod +x start_server.sh

# Create a simple status script
cat > status.sh << EOF
#!/bin/bash
cd $(pwd)
echo "=== Bench Status ==="
bench version
echo
echo "=== Installed Apps on $SITE_NAME ==="
bench --site $SITE_NAME list-apps
echo
echo "=== Services Status ==="
ps aux | grep -E "(redis|mysql)" | grep -v grep
EOF

chmod +x status.sh

print_success "🎉 Frappe-ERPNext setup completed successfully!"
echo
print_status "📝 Summary:"
echo "  • Bench Directory: $(pwd)"
echo "  • Site Name: $SITE_NAME"
echo "  • Site URL: http://$SITE_NAME:8000"
echo "  • Installed Apps: ERPNext, HRMS, EITs Custom App"
echo
print_status "🚀 Next steps:"
echo "1. Start the development server:"
echo "   ./start_server.sh"
echo "   OR"
echo "   bench start"
echo
echo "2. Open your browser and go to: http://$SITE_NAME:8000"
echo "3. Login with:"
echo "   • Username: Administrator"
echo "   • Password: [The password you just set]"
echo
print_status "📁 Useful commands:"
echo "  • Check status: ./status.sh"
echo "  • Stop server: Ctrl+C (when server is running)"
echo "  • Restart server: bench restart"
echo "  • Update apps: bench update"
echo "  • Create new site: bench new-site sitename"
echo
print_warning "💡 Tips:"
echo "  • Keep the terminal open while the server is running"
echo "  • Check logs in case of issues: tail -f logs/web.log"
echo "  • For production setup, consider using supervisor and nginx"

print_status "Setup completed at $(date)"