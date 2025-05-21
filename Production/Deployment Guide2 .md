# Moving Your Frappe Development Environment to Production on a Debian VPS

Moving your Frappe development environment to a production Debian VPS requires several steps to ensure a smooth transition. Here's a comprehensive guide to help you transfer everything from your development environment to your production server.

## 1. Prepare Your Debian VPS

First, SSH into your VPS and prepare the environment:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required dependencies
sudo apt install -y git curl python3-pip python3-dev redis-server 
sudo apt install -y libffi-dev liblcms2-dev libldap2-dev libmariadb-dev 
sudo apt install -y libsasl2-dev libxml2-dev libxslt1-dev mariadb-server 
sudo apt install -y nginx supervisor podman podman-compose

# Create a directory for your project
mkdir -p /opt/frappe
cd /opt/frappe
```

## 2. Install Podman and Set Up Container Environment

```bash
# Configure podman for rootless mode (optional but recommended)
systemctl --user enable podman.socket
systemctl --user start podman.socket
loginctl enable-linger $(whoami)

# Clone Frappe Docker repository
git clone https://github.com/frappe/frappe_docker.git
cd frappe_docker

# Copy environment configuration
cp example.env .env
```

## 3. Configure Your Environment Variables

Edit the `.env` file with appropriate values:

```bash
# Edit .env file
nano .env
```

Update these key variables:
```
FRAPPE_VERSION=v14 # Or your version
ERPNEXT_VERSION=v14 # If using ERPNext
SITE_NAME=your-domain.com
DB_PASSWORD=your-secure-password
ADMIN_PASSWORD=your-admin-password
```

## 4. Backup Your Development Environment

On your development machine:

```bash
# Go to your bench directory
cd path/to/your/frappe-bench

# Create a full backup of your site
bench --site your-site-name backup --with-files

# The backup will be created in sites/your-site-name/private/backups/
# Note the location of the latest backup files (SQL and files archives)
```

## 5. Transfer Backups to Your Production Server

Use SCP to transfer your backup files:

```bash
# From your development machine
scp sites/your-site-name/private/backups/your-latest-backup.sql user@your-vps-ip:/opt/frappe/
scp sites/your-site-name/private/backups/your-latest-files.tar user@your-vps-ip:/opt/frappe/

# Transfer any custom apps as well
cd apps
tar -czf custom_apps.tar.gz your-custom-app1 your-custom-app2
scp custom_apps.tar.gz user@your-vps-ip:/opt/frappe/
```

## 6. Set Up Production Environment with Podman

On your VPS:

```bash
cd /opt/frappe/frappe_docker

# Start the production containers
podman-compose -f docker-compose.yml -f overrides/compose.mariadb.yml -f overrides/compose.redis.yml up -d
```

## 7. Restore Your Development Data

```bash
# Get container IDs
BACKEND_CONTAINER=$(podman ps -qf "name=backend")
DB_CONTAINER=$(podman ps -qf "name=mariadb")

# Copy backup files into containers
podman cp /opt/frappe/your-latest-backup.sql $DB_CONTAINER:/home/
podman cp /opt/frappe/your-latest-files.tar $BACKEND_CONTAINER:/home/

# Create a new site first (don't install any apps yet)
podman exec -it $BACKEND_CONTAINER bench new-site your-domain.com --admin-password your-admin-password --db-name your_database_name

# Restore the database backup
podman exec -it $DB_CONTAINER bash -c "mysql -uroot -p<your-password> your_database_name < /home/your-latest-backup.sql"

# Extract files backup to the correct location
podman exec -it $BACKEND_CONTAINER bash -c "tar -xf /home/your-latest-files.tar -C /home/frappe/frappe-bench/sites/your-domain.com/private/files/"
```

## 8. Install Custom Apps (If Any)

```bash
# Copy your custom apps
podman cp /opt/frappe/custom_apps.tar.gz $BACKEND_CONTAINER:/home/

# Extract and install them
podman exec -it $BACKEND_CONTAINER bash -c "cd /home/frappe/frappe-bench && tar -xzf /home/custom_apps.tar.gz -C ./apps/"
podman exec -it $BACKEND_CONTAINER bash -c "cd /home/frappe/frappe-bench && bench --site your-domain.com install-app your-custom-app1"
podman exec -it $BACKEND_CONTAINER bash -c "cd /home/frappe/frappe-bench && bench --site your-domain.com install-app your-custom-app2"
```

## 9. Configure Production Settings

```bash
# Configure production settings
podman exec -it $BACKEND_CONTAINER bench --site your-domain.com set-config maintenance_mode 0
podman exec -it $BACKEND_CONTAINER bench --site your-domain.com clear-cache
podman exec -it $BACKEND_CONTAINER bench --site your-domain.com add-to-hosts

# Update site configuration
podman exec -it $BACKEND_CONTAINER bash -c "cd /home/frappe/frappe-bench && bench config dns_multitenant on"
```

## 10. Set Up NGINX and SSL

For a production site, you'll want proper NGINX configuration with SSL:

```bash
# Add NGINX proxy configuration
podman-compose -f docker-compose.yml -f overrides/compose.mariadb.yml -f overrides/compose.redis.yml -f overrides/compose.nginx-proxy.yml up -d
```

If you prefer manual SSL configuration:

```bash
# Install Certbot for Let's Encrypt SSL
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Verify NGINX configuration
sudo nginx -t
sudo systemctl restart nginx
```

## 11. Set Up Auto-start with Systemd

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/frappe-podman.service
```

Add the following content:

```ini
[Unit]
Description=Frappe Podman Service
After=network.target

[Service]
Type=oneshot
RemainAfterExit=yes
User=your-username
WorkingDirectory=/opt/frappe/frappe_docker
ExecStart=/usr/bin/podman-compose -f docker-compose.yml -f overrides/compose.mariadb.yml -f overrides/compose.redis.yml -f overrides/compose.nginx-proxy.yml up -d
ExecStop=/usr/bin/podman-compose -f docker-compose.yml -f overrides/compose.mariadb.yml -f overrides/compose.redis.yml -f overrides/compose.nginx-proxy.yml down

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable frappe-podman.service
sudo systemctl start frappe-podman.service
```

## 12. Set Up Regular Backups

Create a backup script:

```bash
sudo nano /opt/frappe/backup.sh
```

Add the following content:

```bash
#!/bin/bash
BACKUP_DIR="/opt/frappe/backups"
DATE=$(date +%Y-%m-%d)
BACKEND_CONTAINER=$(podman ps -qf "name=backend")
mkdir -p "$BACKUP_DIR/$DATE"

# Backup database and files
podman exec $BACKEND_CONTAINER bench --site your-domain.com backup --with-files

# Copy backups to host
podman cp $BACKEND_CONTAINER:/home/frappe/frappe-bench/sites/your-domain.com/private/backups/ "$BACKUP_DIR/$DATE"

# Remove backups older than 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

Make it executable and add to crontab:

```bash
sudo chmod +x /opt/frappe/backup.sh
crontab -e
```

Add the following line for daily backups at 2 AM:

```
0 2 * * * /opt/frappe/backup.sh
```

## 13. Configure Firewall (Optional but Recommended)

```bash
sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

## 14. Set Up Monitoring (Optional)

```bash
# Install monitoring tools
sudo apt install -y munin munin-node

# Configure monitoring for your services
sudo nano /etc/munin/munin.conf
```

## 15. Final Verification

1. Test your site by visiting https://your-domain.com
2. Check for any errors in the logs:
```bash
podman logs $(podman ps -qf "name=backend")
podman logs $(podman ps -qf "name=webserver")
```

3. Verify all your apps are working:
```bash
podman exec -it $(podman ps -qf "name=backend") bench --site your-domain.com list-apps
```

## Troubleshooting Common Issues

1. **Database connection issues**:
   ```bash
   podman exec -it $(podman ps -qf "name=backend") bench --site your-domain.com mariadb
   ```

2. **Permission problems**:
   ```bash
   podman exec -it $(podman ps -qf "name=backend") chown -R frappe:frappe /home/frappe/frappe-bench/sites/your-domain.com
   ```

3. **Site not accessible**:
   Check NGINX configuration and logs:
   ```bash
   podman logs $(podman ps -qf "name=webserver")
   ```

4. **Container not starting**:
   Check for resource constraints:
   ```bash
   podman system df
   df -h
   free -m
   ```

By following these steps, you should have successfully migrated your Frappe development environment to your Debian VPS production server. The containerized approach ensures consistency between environments and simplifies future updates.