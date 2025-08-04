## 1. Setup Database:

- Visit [Neon](https://console.neon.tech)
- Create new project
- Get the credentials 

```bash
DB_HOST="your-neon-host.neon.tech"      # Change to your Neon endpoint
DB_PORT="5432"                          # Neon default port
DB_NAME="your-db-name"                  # Neon database name
DB_USER="your-db-user"                  # Neon database user
DB_PASS="your-db-password" 
```



## 2. Run Operating Level Script

- Script name: bash-script-v2.sh
- Located [here](./Operating%20System%20Script/bash-script-v2.sh)
- Update the database details in the bash script

Now this script file is to sent to AWS EC2, there are 2 ways for this: 



## 2.1. Before starting the instance: 


- While setting up EC2 instance there is a section at the end named "User Data" 
- Paste the contents of bash-script-v2.sh 
- Update the database details 
- Run the instance


## 2.2 Connect to EC2 Instance:

- Use guide from [here](./SSH%20into%20EC2/readme.md)


### Getting the script file inside the EC2 instance. 

- Using SCP we can send file to EC2 from local system. 

- Following is the format
```bash
scp -i /path/to/your-key-file.pem /path/to/local/file username@your-ec2-public-ip:/path/to/destination/
```
- Yes 3 paths are needed: 
    - Path to pem file
    - Path of source file
    - Path of destination file

### 3 Running the script

```bash
sudo sh bash-script-v2.sh
```




frappe user

created frappe-bench





EC2 Space before bench:

```bash
frappe@ip-172-31-13-85:~$ df -h
Filesystem       Size  Used Avail Use% Mounted on
/dev/root        6.8G  4.7G  2.1G  70% /
tmpfs            458M     0  458M   0% /dev/shm
tmpfs            183M  944K  182M   1% /run
tmpfs            5.0M     0  5.0M   0% /run/lock
efivarfs         128K  3.8K  120K   4% /sys/firmware/efi/efivars
/dev/nvme0n1p16  881M   86M  734M  11% /boot
/dev/nvme0n1p15  105M  6.2M   99M   6% /boot/efi
tmpfs             92M   20K   92M   1% /run/user/1000
```


## Remote database: 

```json
 "db_host": "193.203.163.151",
"rds_db": 1
```


gennextit.com

fkYU57LNx1[e9B+C

mysql -h gennextit.com -u gennexti_eitserp_prod -p


Database user: gennexti_eitserp_prod
Database password: fkYU57LNx1[e9B+C
Host: gennextit.com





bench new-site erp.eitsdubai.com --db-host gennextit.com --db-port 3306 --db-root-username gennexti_eitserp_prod



- Needs more priviledges

