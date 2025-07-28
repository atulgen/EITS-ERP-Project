#!/bin/bash

# Frappe/ERPNext Ubuntu/Debian EC2 Setup Script
# Compatible with Ubuntu 22.04 LTS and Debian 11/12
# Recommended OS: Ubuntu 22.04 LTS

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

# Add MariaDB repo (for Ubuntu/Debian)
echo -e "${YELLOW}Adding MariaDB repository...${NC}"
curl -LsS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup | sudo bash -s -- --mariadb-server-version="10.6"

# Add Node.js 16.x LTS
echo -e "${YELLOW}Adding Node.js repository...${NC}"
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

# Add Yarn
echo -e "${YELLOW}Adding Yarn repository...${NC}"
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

# For Debian only: Add Python 3.10 (Ubuntu 22.04 already has it)
if [ "$OS_ID" = "debian" ]; then
    echo -e "${YELLOW}Adding Python 3.10 repository for Debian...${NC}"
    add-apt-repository -y ppa:deadsnakes/ppa
fi

# Update again after adding new repos
apt-get update

# Install all required packages
echo -e "${YELLOW}Installing required packages...${NC}"
apt-get install -y \
    mariadb-server \
    mariadb-client \
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
    libmariadb-dev \
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

# Install wkhtmltopdf (different packages for Ubuntu/Debian)
echo -e "${YELLOW}Installing wkhtmltopdf...${NC}"
if [ "$OS_ID" = "ubuntu" ]; then
    apt-get install -y wkhtmltopdf
    ln -s /usr/bin/wkhtmltopdf /usr/local/bin/wkhtmltopdf
else
    wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.bullseye_amd64.deb
    apt-get install -y ./wkhtmltox_0.12.6.1-2.bullseye_amd64.deb
    rm wkhtmltox_0.12.6.1-2.bullseye_amd64.deb
fi

# Configure MariaDB
echo -e "${YELLOW}Configuring MariaDB...${NC}"
mysql -e "SET GLOBAL innodb_default_row_format='dynamic'"
mysql -e "SET GLOBAL innodb_file_per_table=1"
mysql -e "SET GLOBAL innodb_large_prefix=1"
mysql -e "SET GLOBAL innodb_file_format=Barracuda"

echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${YELLOW}Next steps: Install Frappe Bench and ERPNext using:"
echo -e "  $ bench init frappe-bench --frappe-branch version-15"
echo -e "  $ cd frappe-bench"
echo -e "  $ bench new-site yoursite.com${NC}"