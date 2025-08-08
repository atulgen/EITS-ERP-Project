# AWS EC2 SSH Connection Guide

There are two primary methods to establish SSH connections to your AWS EC2 instances, depending on your operating system and preferred SSH client.

## Method 1: PEM File (Linux/macOS/Windows with OpenSSH)

### Prerequisites
- PEM key file downloaded from AWS
- Terminal/Command Prompt access
- EC2 instance running with proper security group configuration

### Step 1: Set File Permissions
```bash
chmod 400 your-key-file.pem
```

### Step 2: Connect via SSH
```bash
ssh -i /path/to/your-key-file.pem username@your-ec2-public-ip
```

### Common Usernames by AMI Type
- **Amazon Linux 2/2023**: `ec2-user`
- **Ubuntu**: `ubuntu`
- **CentOS**: `centos`
- **RHEL**: `ec2-user` or `root`
- **SUSE**: `ec2-user`
- **Debian**: `admin`

### Example Connection
```bash
ssh -i ~/.ssh/my-ec2-key.pem ec2-user@54.123.45.67
```

---

## Method 2: PPK File (Windows with PuTTY)

### Prerequisites
- PuTTY installed on Windows
- PEM file converted to PPK format using PuTTYgen

### Step 1: Convert PEM to PPK
1. Open **PuTTYgen**
2. Click **Load** and select your PEM file
3. Change file type filter to "All Files (*.*)" if needed
4. Click **Save private key**
5. Choose **Yes** when prompted about passphrase
6. Save as `.ppk` file

### Step 2: Configure PuTTY Session
1. Open **PuTTY**
2. In **Host Name**: Enter `username@your-ec2-public-ip`
3. **Port**: 22
4. **Connection type**: SSH

### Step 3: Configure Authentication
1. Navigate to **Connection → SSH → Auth → Credentials**
2. Browse and select your `.ppk` file in **Private key file for authentication**

### Step 4: Save and Connect
1. Return to **Session** category
2. Enter a name in **Saved Sessions**
3. Click **Save**
4. Click **Open** to connect

---

## Security Group Requirements

Your EC2 instance's security group must allow inbound SSH traffic:

| Type | Protocol | Port | Source |
|------|----------|------|---------|
| SSH | TCP | 22 | Your IP address |

### To Configure Security Group
1. Go to EC2 Console → Security Groups
2. Select your instance's security group
3. Click **Inbound Rules** → **Edit inbound rules**
4. Add rule: Type=SSH, Source=My IP

---

## Troubleshooting Common Issues

### Connection Refused
- Verify security group allows SSH from your IP
- Ensure EC2 instance is running
- Check if SSH service is running on the instance

### Permission Denied (PEM)
- Verify file permissions: `ls -la your-key-file.pem`
- Should show `-r--------` (400 permissions)
- Confirm correct username for your AMI type

### Host Key Verification
- First connection will prompt for host key verification
- Type `yes` to accept and continue
- Key will be saved for future connections

### Timeout Issues
- Verify correct public IP/DNS name
- Check if instance is in public subnet
- Ensure route table has internet gateway route

### PuTTY-Specific Issues
- Ensure PPK file is properly converted from PEM
- Verify correct path to PPK file in PuTTY configuration
- Check that username is included in hostname field

---

## Best Practices

### Security
- Use specific IP ranges in security groups instead of 0.0.0.0/0
- Regularly rotate key pairs
- Consider using AWS Session Manager as an alternative
- Enable CloudTrail for SSH session logging

### Key Management
- Store PEM/PPK files securely
- Backup key files in secure location
- Use descriptive names for key pairs
- Document which keys are used for which instances

### Connection Management
- Save frequently used connections in SSH config or PuTTY sessions
- Use SSH agent for key management on Unix systems
- Consider using SSH tunneling for additional security

---

## Alternative Methods

### AWS Session Manager
- Browser-based shell access
- No need for SSH keys or open ports
- Requires SSM agent on instance
- Access through AWS Console

### EC2 Instance Connect
- Temporary SSH access through AWS Console
- Uses AWS credentials for authentication
- Limited to Amazon Linux 2 and Ubuntu instances

### VS Code Remote SSH
- Direct development environment access
- Uses standard SSH configuration
- Supports both PEM and PPK methods through extensions