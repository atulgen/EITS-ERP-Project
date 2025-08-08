```bash
frappe@ip-172-31-13-85:~$ bench init frappe-bench
Setting Up Environment
$ python3 -m venv env
$ /home/frappe/frappe-bench/env/bin/python -m pip install --quiet --upgrade pip
$ /home/frappe/frappe-bench/env/bin/python -m pip install --quiet wheel
Getting frappe
$ git clone https://github.com/frappe/frappe.git  --depth 1 --origin upstream
Cloning into 'frappe'...
remote: Enumerating objects: 3297, done.
remote: Counting objects: 100% (3297/3297), done.
remote: Compressing objects: 100% (2887/2887), done.
remote: Total 3297 (delta 438), reused 2344 (delta 319), pack-reused 0 (from 0)
Receiving objects: 100% (3297/3297), 15.91 MiB | 16.81 MiB/s, done.
Resolving deltas: 100% (438/438), done.
Installing frappe
Traceback (most recent call last):
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/commands/make.py", line 75, in init
    init(
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/utils/render.py", line 105, in wrapper_fn
    return fn(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/utils/system.py", line 87, in init
    get_app(
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/app.py", line 781, in get_app
    app.install(verbose=verbose, skip_assets=skip_assets, restart_bench=restart_bench)
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/utils/render.py", line 126, in wrapper_fn
    return fn(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/app.py", line 253, in install
    install_app(
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/app.py", line 920, in install_app
    check_pkg_config()
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/utils/system.py", line 227, in check_pkg_config
    raise Exception("pkg-config is not installed. Please install it before proceeding.\n"
Exception: pkg-config is not installed. Please install it before proceeding.
You can refer to https://docs.frappe.io/framework/user/en/installation

ERROR: There was a problem while creating frappe-bench
Do you want to rollback these changes? [y/N]: y
INFO: Rolling back Bench "frappe-bench"
frappe@ip-172-31-13-85:~$ 
```

### Solution

```bash
sudo apt install pkg-config
```


