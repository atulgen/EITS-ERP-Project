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

Admin password: my4v10lMSyUJD1f@YwzGkJ



frappe user

created frappe-bench



