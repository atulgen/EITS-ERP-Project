```bash
pymysql.err.OperationalError: (2003, "Can't connect to MySQL server on '127.0.0.1' ([Errno 111] Connection refused)")
```


```bash
atuld@atulya:~$ sudo service mysql status
[sudo] password for atuld: 
× mariadb.service - MariaDB 10.11.11 database server
     Loaded: loaded (/lib/systemd/system/mariadb.service; enabled; preset: enabled)
     Active: failed (Result: oom-kill) since Mon 2025-08-25 11:10:11 UTC; 11min ago
   Duration: 4d 1h 25min 27.102s
       Docs: man:mariadbd(8)
             https://mariadb.com/kb/en/library/systemd/
    Process: 659 ExecStart=/usr/sbin/mariadbd $MYSQLD_OPTS $_WSREP_NEW_CLUSTER $_WSREP_START_POSITION (code=killed, signal=KILL)
   Main PID: 659 (code=killed, signal=KILL)
     Status: "Taking your SQL requests now..."
        CPU: 19min 43.241s

Aug 25 10:07:45 atulya mariadbd[659]: 2025-08-25 10:07:45 90483 [Warning] Aborted connection 90483 to db: '_c566f86c64481d58' user: '_c566f86c64481d58' host: 'localhost' (Got >
Aug 25 10:16:22 atulya mariadbd[659]: 2025-08-25 10:16:22 90904 [Warning] Aborted connection 90904 to db: '_c566f86c64481d58' user: '_c566f86c64481d58' host: 'localhost' (Got >
Aug 25 10:16:37 atulya mariadbd[659]: 2025-08-25 10:16:37 90913 [Warning] Aborted connection 90913 to db: '_c566f86c64481d58' user: '_c566f86c64481d58' host: 'localhost' (Got >
Aug 25 10:16:47 atulya mariadbd[659]: 2025-08-25 10:16:47 90915 [Warning] Aborted connection 90915 to db: '_c566f86c64481d58' user: '_c566f86c64481d58' host: 'localhost' (Got >
Aug 25 10:28:45 atulya mariadbd[659]: 2025-08-25 10:28:45 91095 [Warning] Host name 'hosted-by.vmheaven.io' could not be resolved: Name or service not known
Aug 25 10:28:45 atulya mariadbd[659]: 2025-08-25 10:28:45 91095 [Warning] Access denied for user 'root'@'45.156.87.251' (using password: NO)
Aug 25 11:10:09 atulya systemd[1]: mariadb.service: A process of this unit has been killed by the OOM killer.
Aug 25 11:10:11 atulya systemd[1]: mariadb.service: Main process exited, code=killed, status=9/KILL
Aug 25 11:10:11 atulya systemd[1]: mariadb.service: Failed with result 'oom-kill'.
Aug 25 11:10:11 atulya systemd[1]: mariadb.service: Consumed 19min 43.241s CPU time.
lines 1-21/21 (END)
```


## Error Logging

```bash

atuld@atulya:~$ # SystemD systems:
sudo journalctl -u mariadb.service -f
sudo journalctl -u mysql.service -f
Aug 25 11:23:53 atulya systemd[1]: Started mariadb.service - MariaDB 10.11.11 database server.
Aug 25 11:23:53 atulya /etc/mysql/debian-start[119183]: Upgrading MySQL tables if necessary.
Aug 25 11:23:53 atulya mariadbd[119166]: 2025-08-25 11:23:53 3 [Warning] Access denied for user 'root'@'localhost' (using password: NO)
Aug 25 11:23:53 atulya /etc/mysql/debian-start[119186]: Reading datadir from the MariaDB server failed. Got the following error when executing the 'mysql' command line client
Aug 25 11:23:53 atulya /etc/mysql/debian-start[119186]: ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
Aug 25 11:23:53 atulya /etc/mysql/debian-start[119186]: FATAL ERROR: Upgrade failed
Aug 25 11:23:53 atulya /etc/mysql/debian-start[119192]: Checking for insecure root accounts.
Aug 25 11:23:53 atulya mariadbd[119166]: 2025-08-25 11:23:53 4 [Warning] Access denied for user 'root'@'localhost' (using password: NO)
Aug 25 11:23:53 atulya debian-start[119195]: ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
Aug 25 11:23:53 atulya mariadbd[119166]: 2025-08-25 11:23:53 0 [Note] InnoDB: Buffer pool(s) load completed at 250825 11:23:53

```


## Analysis:


## 1. **OOM Kill (Out of Memory) - The Root Cause**
```
Aug 25 11:10:11 atulya systemd[1]: mariadb.service: Failed with result 'oom-kill'.
```
MariaDB was killed by the Linux OOM (Out of Memory) killer because your system ran out of memory. This is why you got the "Connection refused" error - MariaDB wasn't running.

## 2. **Authentication Issue After Restart**
After MariaDB restarted at 11:23:52, it's running but there are root user authentication problems:
```
ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
```

## Immediate Solutions:

### Fix the Memory Issue:
```bash
# Check current memory usage:
free -h
top -p $(pgrep mariadb)

# Check MariaDB memory configuration:
mysql -u root -p -e "SHOW VARIABLES LIKE '%buffer%';"
mysql -u root -p -e "SHOW VARIABLES LIKE 'innodb_buffer_pool_size';"
```

### Fix Authentication (try these in order):
```bash
# Option 1: Try with sudo (uses auth_socket plugin):
sudo mysql -u root

# Option 2: Reset root password:
sudo systemctl stop mariadb
sudo mysqld_safe --skip-grant-tables --skip-networking &
mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';"
sudo systemctl start mariadb

# Option 3: Use debian-sys-maint user:
sudo mysql --defaults-file=/etc/mysql/debian.cnf
```

### Prevent Future OOM Kills:
Edit MariaDB configuration to use less memory:
```bash
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```

Add/modify these settings:
```ini
[mysqld]
innodb_buffer_pool_size = 64M  # Reduce from default 128M
key_buffer_size = 16M
query_cache_size = 8M
tmp_table_size = 16M
max_heap_table_size = 16M
```

Then restart:
```bash
sudo systemctl restart mariadb
```

### Monitor Memory:
```bash
# Watch memory usage:
watch -n 2 'free -h && echo "MariaDB:" && ps aux | grep mariadb | grep -v grep'
```

**Current Status**: MariaDB is running (started at 11:23:53) but you need to fix the authentication to connect. The OOM kill explains your original connection error - the service was down due to memory exhaustion.

What's your system's total RAM? Run `free -h` to check.