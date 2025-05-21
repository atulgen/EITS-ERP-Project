# Setting Up Frappe/ERPNext in Production Using Podman

Yes, using Podman is an excellent choice for containerizing Frappe. It's a daemonless container engine that's more security-focused and can be used as a drop-in replacement for Docker. Here's a comprehensive guide for setting up your Frappe development container and running it in production with Podman.

## Prerequisites

First, install Podman and Podman Compose on your Nobara Linux:

```bash
sudo dnf install podman podman-compose
```

## Step 1: Clone the Frappe Docker Repository

```bash
git clone https://github.com/frappe/frappe_docker.git
cd frappe_docker
```

## Step 2: Set Up Environment Variables

Create an environment file:

```bash
cp example.env .env
```

Edit the `.env` file and set the following variables:

- `FRAPPE_VERSION` (e.g., v14)
- `ERPNEXT_VERSION` (if you're using ERPNext)
- `SITE_NAME` (e.g., mysite.localhost)

## Step 3: Adapt Docker Compose Files for Podman

Podman Compose works with Docker Compose files, but sometimes you need to make small adjustments. Create a symbolic link to use `docker-compose.yml` with podman-compose:

```bash
ln -sf docker-compose.yml podman-compose.yml
```

## Step 4: Deploy with Podman Compose

For a full production deployment with MariaDB and Redis:

```bash
podman-compose -f podman-compose.yml -f overrides/compose.mariadb.yml -f overrides/compose.redis.yml up -d
```

This will pull the images and start the containers in detached mode.

## Step 5: Create a New Site or Restore Existing Data

### For a new site:

```bash
podman exec -it $(podman ps -qf "name=backend") bench new-site your-site-name --admin-password your-password --install-app erpnext
```

### To restore a backup from your development environment:

1. Copy your SQL backup to the container:

```bash
podman cp /path/to/your/backup.sql $(podman ps -qf "name=mariadb"):/home/
```

2. Restore the database:

```bash
podman exec -it $(podman ps -qf "name=mariadb") bash -c "mysql -uroot -p<your-password> your-site-name < /home/backup.sql"
```

3. Copy and restore your site files (if needed):

```bash
podman cp /path/to/your/site-files/ $(podman ps -qf "name=backend"):/home/frappe/frappe-bench/sites/your-site-name/
```

## Step 6: Configure Production Settings

```bash
podman exec -it $(podman ps -qf "name=backend") bench --site your-site-name set-config maintenance_mode 0
podman exec -it $(podman ps -qf "name=backend") bench --site your-site-name clear-cache
```

## Step 7: Enable Persistence with Podman Volumes

Ensure data persistence by setting up proper volumes:

```bash
podman volume create frappe-sites
podman volume create frappe-mariadb
podman volume create frappe-redis-cache
podman volume create frappe-redis-queue
podman volume create frappe-redis-socketio
```

Modify your podman-compose files to use these volumes instead of local directories for better data management.

## Step 8: Set Up Systemd Services for Auto-start (Optional)

Create a systemd service to auto-start your Podman containers:

```bash
mkdir -p ~/.config/systemd/user/
```

Create a file `~/.config/systemd/user/frappe-podman.service`:

```ini
[Unit]
Description=Frappe Podman Service
After=network.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/path/to/your/frappe_docker
ExecStart=/usr/bin/podman-compose -f podman-compose.yml -f overrides/compose.mariadb.yml -f overrides/compose.redis.yml up -d
ExecStop=/usr/bin/podman-compose -f podman-compose.yml -f overrides/compose.mariadb.yml -f overrides/compose.redis.yml down

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
systemctl --user enable frappe-podman.service
systemctl --user start frappe-podman.service
```

Enable lingering to allow the service to run on boot:

```bash
loginctl enable-linger $(whoami)
```

## Step 9: Secure Your Environment

1. **Restrict direct container access**:

   ```bash
   podman network create frappe-network
   ```

   Update your compose files to use this network.

2. **Enable SELinux contexts** for added security:
   ```bash
   sudo semanage fcontext -a -t container_file_t "/path/to/persistent/data(/.*)?"
   sudo restorecon -Rv /path/to/persistent/data
   ```

## Step 10: Set Up Backup Routines

Create a script for automated backups:

```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y-%m-%d)
mkdir -p "$BACKUP_DIR/$DATE"

# Backup database
podman exec $(podman ps -qf "name=backend") bench --site your-site-name backup
podman cp $(podman ps -qf "name=backend"):/home/frappe/frappe-bench/sites/your-site-name/private/backups/ "$BACKUP_DIR/$DATE"
```

Set up a cron job to run this script regularly.

## Additional Tips

1. **Monitoring**: Consider setting up a monitoring solution for your containers:

   ```bash
   podman pod create --name monitoring
   podman run --pod monitoring -d --name prometheus quay.io/prometheus/prometheus
   podman run --pod monitoring -d --name grafana docker.io/grafana/grafana
   ```

2. **Updating containers**:

   ```bash
   podman-compose -f podman-compose.yml -f overrides/compose.mariadb.yml -f overrides/compose.redis.yml pull
   podman-compose -f podman-compose.yml -f overrides/compose.mariadb.yml -f overrides/compose.redis.yml up -d
   ```

3. **SSL with Let's Encrypt**:
   For production sites, set up an NGINX proxy with Let's Encrypt:

   ```bash
   podman-compose -f podman-compose.yml -f overrides/compose.mariadb.yml -f overrides/compose.redis.yml -f overrides/compose.nginx-proxy.yml up -d
   ```

4. **Resource limits**: Set resource limits for containers:
   ```bash
   podman run --cpus=2 --memory=4g --name frappe-backend frappe/erpnext-worker:v14
   ```

This approach will help you run Frappe in production on Nobara Linux without dealing with OS-specific compatibility issues you were facing with Ansible playbooks.
