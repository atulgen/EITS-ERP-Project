1. Get the install-frappe-dependencies.sh to VPS
2. sudo mariadb_secure_installation
3. Create frappe user




pkg-config
- to be added in dependancies

# Install pipx first
sudo apt update
sudo apt install pipx

# Install frappe-bench using pipx
pipx install frappe-bench

# Add pipx binaries to PATH
pipx ensurepath

# Reload your shell or run:
source ~/.bashrc

# Verify installation
bench --version


bench init eits-bench --frappe-branch version-15



---

- Nginx
- sslcertificates erp.eitsdubai.com


---

sudo apt install nginx


---



pipx install ansible

    # ERPNext Static Files
    location /assets {
        alias /home/frappe/eits-bench/sites/assets;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location /files {
        alias /home/frappe/eits-bench/sites/erp.eitsdubai.com/public/files;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }



---




bench set-config -g server_script_enabled 1


