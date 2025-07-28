#!/bin/bash

# Frappe/ERPNext Ubuntu/Debian EC2 Setup Script (No Local DB + Frappe User)
# Compatible with Ubuntu 22.04 LTS and Debian 11/12
# Creates a 'frappe' user and configures environment for remote DB (RDS)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
    echo -e "${RED}This script must be run as root${NC}" >&2
    exit 1
fi

# Detect OS
OS_ID=$(grep -oP '(?<=^ID=).+' /etc/os-release | tr -d '"')
OS_VERSION=$(grep -oP '(?<=^VERSION_ID=).+' /etc/os-release | tr -d '"')

echo -e "${GREEN}Detected OS: $OS_ID $OS_VERSION${NC}"

# Update system and install prerequisites
echo -e "${YELLOW}Updating system and installing prerequisites...${NC}"
apt-get update
apt-get upgrade -y
apt-get install -y curl wget sudo gnupg2 ca-certificates lsb-release apt-transport-https software-properties-common

# Add Node.js 16.x LTS
echo -e "${YELLOW}Adding Node.js repository...${NC}"
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

# Add Yarn
echo -e "${YELLOW}Adding Yarn repository...${NC}"
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

# For Debian only: Add Python 3.10
if [ "$OS_ID" = "debian" ]; then
    echo -e "${YELLOW}Adding Python 3.10 repository for Debian...${NC}"
    add-apt-repository -y ppa:deadsnakes/ppa
fi

apt-get update

# Install required packages (excluding mariadb-server)
echo -e "${YELLOW}Installing required packages...${NC}"
apt-get install -y \
    python3.10 \
    python3.10-dev \
    python3.10-venv \
    python3-setuptools \
    python3-pip \
    python3-testresources \
    virtualenv \
    redis-server \
    nodejs \
    yarn \
    git \
    cron \
    supervisor \
    nginx \
    build-essential \
    libffi-dev \
    libssl-dev \
    libmariadb-dev \  # Required for mysqlclient
    libxslt1-dev \
    libldap2-dev \
    libsasl2-dev \
    libzip-dev \
    xvfb \
    fontconfig \
    libfreetype6 \
    libx11-6 \
    libxext6 \
    libxrender1 \
    xfonts-75dpi \
    xfonts-base

# Install wkhtmltopdf
echo -e "${YELLOW}Installing wkhtmltopdf...${NC}"
if [ "$OS_ID" = "ubuntu" ]; then
    apt-get install -y wkhtmltopdf
    ln -s /usr/bin/wkhtmltopdf /usr/local/bin/wkhtmltopdf
else
    wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.bullseye_amd64.deb
    apt-get install -y ./wkhtmltox_0.12.6.1-2.bullseye_amd64.deb
    rm wkhtmltox_0.12.6.1-2.bullseye_amd64.deb
fi

# Create dedicated 'frappe' user
echo -e "${YELLOW}Creating 'frappe' user...${NC}"
if ! id -u frappe >/dev/null 2>&1; then
    useradd -m -s /bin/bash frappe
    usermod -aG sudo frappe  # Add to sudoers (required for bench)
    echo -e "${GREEN}'frappe' user created. Set a password for 'frappe' user:${NC}"
    passwd frappe
else
    echo -e "${YELLOW}'frappe' user already exists. Skipping creation.${NC}"
fi

# Configure sudoers for 'frappe' user (passwordless sudo for bench commands)
echo -e "${YELLOW}Configuring sudoers for 'frappe' user...${NC}"
echo "frappe ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/frappe
chmod 440 /etc/sudoers.d/frappe

# Switch to 'frappe' user for final setup
echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${YELLOW}Next steps:"
echo -e "1. Switch to 'frappe' user and install Frappe Bench:"
echo -e "   $ sudo su - frappe"
echo -e "   $ bench init frappe-bench --frappe-branch version-15"
echo -e "2. Create a new site with RDS credentials:"
echo -e "   $ bench new-site yoursite.com \\"
echo -e "     --mariadb-host=your-rds-endpoint.rds.amazonaws.com \\"
echo -e "     --mariadb-root-username=admin \\"
echo -e "     --mariadb-root-password=yourpassword${NC}"