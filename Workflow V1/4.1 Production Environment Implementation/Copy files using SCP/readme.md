Here's how to transfer files from your local machine to EC2 using SCP:

## Basic SCP Syntax
```bash
scp -i /path/to/your-key-file.pem /path/to/local/file username@your-ec2-public-ip:/path/to/destination/
```

## Single File Transfer
```bash
scp -i ~/.ssh/my-ec2-key.pem /home/user/document.txt ec2-user@54.123.45.67:/home/ec2-user/
```

## Multiple Files Transfer
```bash
scp -i ~/.ssh/my-ec2-key.pem file1.txt file2.txt file3.txt ec2-user@54.123.45.67:/home/ec2-user/
```

## Directory Transfer (Recursive)
```bash
scp -i ~/.ssh/my-ec2-key.pem -r /path/to/local/directory/ ec2-user@54.123.45.67:/home/ec2-user/
```

## Common Examples

### Upload a single file to home directory
```bash
scp -i ~/.ssh/my-key.pem ~/Downloads/app.zip ec2-user@54.123.45.67:~/
```

### Upload to specific directory with sudo permissions needed
```bash
# First upload to home directory
scp -i ~/.ssh/my-key.pem ~/config.conf ec2-user@54.123.45.67:~/

# Then SSH in and move with sudo
ssh -i ~/.ssh/my-key.pem ec2-user@54.123.45.67
sudo mv ~/config.conf /etc/
```

### Upload entire project folder
```bash
scp -i ~/.ssh/my-key.pem -r ~/my-project/ ec2-user@54.123.45.67:~/
```

## Download from EC2 to Local (Reverse)
```bash
# Download single file
scp -i ~/.ssh/my-key.pem ec2-user@54.123.45.67:~/remote-file.txt ~/Downloads/

# Download directory
scp -i ~/.ssh/my-key.pem -r ec2-user@54.123.45.67:~/remote-directory/ ~/Downloads/
```

## Useful SCP Options
- `-r`: Recursive (for directories)
- `-v`: Verbose output
- `-P port`: Specify port (if not 22)
- `-C`: Enable compression
- `-p`: Preserve file timestamps and permissions

## Example with Options
```bash
scp -i ~/.ssh/my-key.pem -r -v -C ~/my-app/ ec2-user@54.123.45.67:~/
```

## Windows with PuTTY (PSCP)
If using PuTTY on Windows, use PSCP:
```cmd
pscp -i your-key-file.ppk C:\path\to\local\file.txt ec2-user@54.123.45.67:/home/ec2-user/
```

## Troubleshooting
- **Permission denied**: Check file permissions and ensure destination directory is writable
- **Connection issues**: Same troubleshooting as SSH (security groups, key permissions)
- **Large files**: Consider using `-C` flag for compression
- **Progress monitoring**: Use `-v` for verbose output to see transfer progress

The transfer will use the same authentication and security group requirements as SSH connections.

# [Back to Main](../readme.md)