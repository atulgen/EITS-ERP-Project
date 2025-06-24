## Install Docker Desktop

## In powershell as administrator run

```
wsl --install
it installs a ubuntu
```

### After this 
- open docker desktop
- press settings icon
- Select resources and inside it fourth option (WSL Integration)
- Enable Ubuntu

### Re open ubuntu terminal

### Run These commands 

```
sudo apt update
```

```
sudo apt install python3-pip
```

```
python3 -m pip install --user pipx
```

```
python3 -m pipx ensurepath
```

```
pipx install frappe-manager
```

```
fm --install-completion
```

```
 fm self update
```

## Create frappe bench 

```
fm create mybench
```

#### if any error occurs then reinstall docker images manaually 

then again run 

```
fm create mybench
```

### Access it by a url at the table in terminal (like mybench.localhost) click open it.


### Copy username and password from terminal and access your account
