#!/bin/bash

# Frappe Debian EC2 Setup Script
# This script prepares a fresh Debian EC2 instance for Frappe Framework installation
# Tested on Debian 11/12

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

# Update system and install prerequisites
echo -e "${YELLOW}Updating system and installing prerequisites...${NC}"
apt-get update
apt-get upgrade -y
apt-get install -y curl wget sudo gnupg2 ca-certificates lsb-release apt-transport-https

# Add MariaDB repo
echo -e "${YELLOW}Adding MariaDB repository...${NC}"
curl -LsS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup | sudo bash -s -- --mariadb-server-version="10.6"

# Add Node.js repo
echo -e "${YELLOW}Adding Node.js repository...${NC}"
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

# Add Yarn repo
echo -e "${YELLOW}Adding Yarn repository...${NC}"
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

# Add Python repo (for newer Python versions if needed)
echo -e "${YELLOW}Adding Python repository...${NC}"
apt-get install -y software-properties-common
add-apt-repository -y ppa:deadsnakes/ppa

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
    wkhtmltopdf \
    xvfb \
    fontconfig \
    libfreetype6 \
    libjpeg62-turbo \
    libx11-6 \
    libxext6 \
    libxrender1 \
    xfonts-75dpi \
    xfonts-base

# Install wkhtmltopdf from official package (Debian's version is often outdated)
echo -e "${YELLOW}Installing wkhtmltopdf...${NC}"
wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.bullseye_amd64.deb
apt-get install -y ./wkhtmltox_0.12.6.1-2.bullseye_amd64.deb
rm wkhtmltox_0.12.6.1-2.bullseye_amd64.deb

# Configure MariaDB
echo -e "${YELLOW}Configuring MariaDB...${NC}"
mysql -e "SET GLOBAL innodb_default_row_format='dynamic'"
mysql -e "SET GLOBAL innodb_file_per_table=1"
mysql -e "SET GLOBAL innodb_large_prefix=1"
mysql -e "SET GLOBAL innodb_file_format=Barracuda"