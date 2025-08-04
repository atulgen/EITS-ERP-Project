#!/bin/bash

# Frappe-ERPNext Version-15 Dependencies Installation Script
# For Ubuntu 22.04 LTS
# This script installs all prerequisites and frappe-bench

set -e  # Exit on any error

echo "🚀 Starting Frappe-ERPNext v15 Dependencies Installation..."
echo "📋 This will install: Python 3.11, Node.js 18, MariaDB, Redis, and more"

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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# STEP 1: Install git
print_status "Installing Git..."
sudo apt-get install -y git
print_success "Git installed successfully"

# Check Ubuntu version and install Python 3.11 if needed
UBUNTU_VERSION=$(lsb_release -rs)
if [[ $(echo "$UBUNTU_VERSION >= 23.04" | bc -l) -eq 1 ]]; then
    print_success "Ubuntu $UBUNTU_VERSION detected - Python 3.11 should be default"
else
    print_status "Installing Python 3.11 for Ubuntu $UBUNTU_VERSION..."
    sudo add-apt-repository ppa:deadsnakes/ppa -y
    sudo apt update
    sudo apt install -y python3.11 python3.11-full
    print_success "Python 3.11 installed successfully"
fi

# Verify Python version
PYTHON_VERSION=$(python3.11 --version)
print_success "Python version: $PYTHON_VERSION"

# STEP 2: Install python-dev
print_status "Installing Python development files..."
sudo apt-get install -y python3-dev

# STEP 3: Install setuptools and pip
print_status "Installing Python setuptools and pip..."
sudo apt-get install -y python3-setuptools python3-pip

# STEP 4: Install virtualenv
print_status "Installing Python virtual environment..."
sudo apt install -y python3.11-venv

# STEP 5: Install MariaDB
print_status "Installing MariaDB..."
sudo apt-get install -y software-properties-common
sudo apt install -y mariadb-server

print_warning "MariaDB installed. You'll need to run 'sudo mysql_secure_installation' manually after this script completes."
print_warning "Remember to set a strong root password and answer Y to most security questions."

# STEP 6: Install MySQL database development files
print_status "Installing MySQL development files..."
sudo apt-get install -y libmysqlclient-dev

# STEP 7: Configure MariaDB
print_status "Configuring MariaDB for Frappe..."
sudo tee /etc/mysql/mariadb.conf.d/50-server.cnf > /dev/null <<EOF
[server]
user = mysql
pid-file = /run/mysqld/mysqld.pid
socket = /run/mysqld/mysqld.sock
basedir = /usr
datadir = /var/lib/mysql
tmpdir = /tmp
lc-messages-dir = /usr/share/mysql
bind-address = 127.0.0.1
query_cache_size = 16M
log_error = /var/log/mysql/error.log

[mysqld]
innodb-file-format=barracuda
innodb-file-per-table=1
innodb-large-prefix=1
character-set-client-handshake = FALSE
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci      
 
[mysql]
default-character-set = utf8mb4
EOF

print_status "Restarting MySQL service..."
sudo service mysql restart
print_success "MariaDB configured successfully"

# STEP 8: Install Redis
print_status "Installing Redis..."
sudo apt-get install -y redis-server
print_success "Redis installed successfully"

# STEP 9: Install Node.js 18.x using NVM
print_status "Installing Node.js 18 via NVM..."
sudo apt install -y curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

print_success "Node.js $(node --version) installed successfully"

# STEP 10: Install Yarn
print_status "Installing Yarn..."
sudo apt-get install -y npm
sudo npm install -g yarn
print_success "Yarn $(yarn --version) installed successfully"

# STEP 11: Install wkhtmltopdf
print_status "Installing wkhtmltopdf..."
sudo apt-get install -y xvfb libfontconfig wkhtmltopdf
print_success "wkhtmltopdf installed successfully"

# STEP 12: Install frappe-bench
print_status "Installing frappe-bench..."
sudo -H pip3 install frappe-bench

# Verify bench installation
BENCH_VERSION=$(bench --version)
print_success "Frappe-bench $BENCH_VERSION installed successfully"

# Add bench to PATH if not already there
if ! grep -q 'export PATH=$PATH:~/.local/bin' ~/.bashrc; then
    echo 'export PATH=$PATH:~/.local/bin' >> ~/.bashrc
    print_status "Added bench to PATH in ~/.bashrc"
fi

print_success "🎉 All dependencies installed successfully!"
print_warning "⚠️  Important next steps:"
echo "1. Run 'sudo mariadb_secure_installation' to secure MariaDB"
echo "   • Press ENTER for current root password (none initially)"
echo "   • Switch to unix_socket authentication: Y"
echo "   • Change root password: Y (SET A STRONG PASSWORD)"
echo "   • Remove anonymous users: Y"
echo "   • Disallow root login remotely: Y"
echo "   • Remove test database: Y"
echo "   • Reload privilege tables: Y"
echo
echo "2. Restart your terminal or run 'source ~/.bashrc'"
echo "3. Run the site setup script to create your Frappe bench and site"
echo "   • You'll need the MariaDB root password you set in step 1"
echo "   • You'll set an Administrator password for your ERPNext site"

print_status "Installation completed at $(date)"



