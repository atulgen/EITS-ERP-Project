# Frappe-ERPNext Version-15 in Ubuntu 22.04 LTS

### Official Documentation:

- [Prerequisites](https://docs.frappe.io/framework/user/en/prerequisites)
- [Installation](https://docs.frappe.io/framework/user/en/installation)

A complete Guide to Install Frappe/ERPNext version 15 in Ubuntu 22.04 LTS

#### Refer this for default python 3.11 setup

- [D-codeE Video Tutorial](https://youtu.be/TReR0I0O1Xo)

## Pre-requisites
```

Python 3.11+
Node.js 18+
Redis 5 (caching and real time updates)
MariaDB 10.3.x / Postgres 9.5.x (to run database driven apps)
yarn 1.12+ (js dependency manager)
pip 20+ (py dependency manager)
wkhtmltopdf (version 0.12.5 with patched qt) (for pdf generation)
cron (bench's scheduled jobs: automated certificate renewal, scheduled backups)
NGINX (proxying multitenant sites in production)

````

---

## Steps to Install python 3.11.xx

> **Note:** If you are using ubuntu 23.xx or latest the default python version is 3.11.xx. So you can skip the python 3.11 installation steps

#### First, import the Python repository with the most up-to-date stable releases.
```bash
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
````

#### Install Python 3.11

```bash
sudo apt install python3.11
python3.11 --version
```

#### To install all the extras in one go

```bash
sudo apt install python3.11-full
```

#### References for default python 3.11 setup:

- [www.linuxcapable.com](https://www.linuxcapable.com/how-to-install-python-3-11-on-ubuntu-linux/#google_vignette)
- [ubuntuhandbook.org](https://ubuntuhandbook.org/index.php/2022/10/python-3-11-released-how-install-ubuntu)

---

## Installation Steps

### STEP 1: Install git

```bash
sudo apt-get install git
```

### STEP 2: Install python-dev

```bash
sudo apt-get install python3-dev
```

### STEP 3: Install setuptools and pip

```bash
sudo apt-get install python3-setuptools python3-pip
```

### STEP 4: Install virtualenv

```bash
sudo apt install python3.11-venv
```

### STEP 5: Install MariaDB

```bash
sudo apt-get install software-properties-common
sudo apt install mariadb-server
sudo mysql_secure_installation
```

Follow these responses during MariaDB secure installation:

```
Enter current password for root (enter for none): [PRESS ENTER]
Switch to unix_socket authentication [Y/n] Y
Change the root password? [Y/n] Y
[Set your new password]
Remove anonymous users? [Y/n] Y
Disallow root login remotely? [Y/n] Y
Remove test database and access to it? [Y/n] Y
Reload privilege tables now? [Y/n] Y
```

### STEP 6: MySQL database development files

```bash
sudo apt-get install libmysqlclient-dev
```

### STEP 7: Edit the MariaDB configuration (unicode character encoding)

```bash
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```

Add this to the 50-server.cnf file:

```ini
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
```

Save and exit (Ctrl-X), then restart MySQL:

```bash
sudo service mysql restart
```

### STEP 8: Install Redis

```bash
sudo apt-get install redis-server
```

### STEP 9: Install Node.js 18.X package

```bash
sudo apt install curl
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.profile
nvm install 18
```

### STEP 10: Install Yarn

```bash
sudo apt-get install npm
sudo npm install -g yarn
```

### STEP 11: Install wkhtmltopdf

```bash
sudo apt-get install xvfb libfontconfig wkhtmltopdf
```

### STEP 12: Install frappe-bench

```bash
sudo -H pip3 install frappe-bench
bench --version
```

### STEP 13: Initialize the frappe bench & install frappe latest version

```bash
bench init frappe-bench --frappe-branch version-15 --python python3.11
cd frappe-bench/
bench start
```

### STEP 14: Create a site in frappe bench

```bash
bench new-site eits.local
bench --site eits.local add-to-hosts
```

Open URL http://eits.local:8000 to login

### STEP 15: Install ERPNext latest version in bench & site

```bash
bench get-app erpnext --branch version-15
# OR
bench get-app https://github.com/frappe/erpnext --branch version-15

bench --site eits.local install-app erpnext
bench start
```

### STEP 16: Install HRMS

```bash
bench get-app hrms
bench --site eits.local install-app hrms
```

### STEP 17: Install eits_app

```bash
bench get-app https://github.com/atulgen/eits_app
bench --site eits.local install-app eits_app
```


### [Back to Workflow](../readme.md)