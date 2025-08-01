## Issue

```bash

frappe@ip-172-31-13-85:~/frappe-bench/sites$ bench get-app erpnext --branch version-15
Getting erpnext
$ git clone https://github.com/frappe/erpnext.git --branch version-15 --depth 1 --origin upstream
Cloning into 'erpnext'...
remote: Enumerating objects: 4882, done.
remote: Counting objects: 100% (4882/4882), done.
remote: Compressing objects: 100% (4075/4075), done.
Receiving objects: 100% (4882/4882), 16.66 MiB | 8.82 MiB/s, done.
remote: Total 4882 (delta 917), reused 3179 (delta 587), pack-reused 0 (from 0)
Resolving deltas: 100% (917/917), done.
Ignoring dependencies of erpnext. To install dependencies use --resolve-deps
Installing erpnext
$ /home/frappe/frappe-bench/env/bin/python -m pip install --quiet --upgrade -e /home/frappe/frappe-bench/apps/erpnext 
  DEPRECATION: Building 'plaid-python' using the legacy setup.py bdist_wheel mechanism, which will be removed in a future version. pip 25.3 will enforce this behaviour change. A possible replacement is to use the standardized build interface by setting the `--use-pep517` option, (possibly combined with `--no-build-isolation`), or adding a `pyproject.toml` file to the source tree of 'plaid-python'. Discussion can be found at https://github.com/pypa/pip/issues/6334
  DEPRECATION: Building 'googlemaps' using the legacy setup.py bdist_wheel mechanism, which will be removed in a future version. pip 25.3 will enforce this behaviour change. A possible replacement is to use the standardized build interface by setting the `--use-pep517` option, (possibly combined with `--no-build-isolation`), or adding a `pyproject.toml` file to the source tree of 'googlemaps'. Discussion can be found at https://github.com/pypa/pip/issues/6334
$ yarn install --check-files
yarn install v1.22.22
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
Done in 0.33s.
$ bench build --app erpnext
Failed to log error in db: Filelock: Failed to aquire {lock_path}
Traceback (most recent call last):
  File "/home/frappe/frappe-bench/apps/frappe/frappe/utils/synchronization.py", line 40, in filelock
    with _StrongFileLock(lock_path, timeout=timeout):
  File "/home/frappe/frappe-bench/env/lib/python3.12/site-packages/filelock/_api.py", line 314, in __enter__
    self.acquire()
  File "/home/frappe/frappe-bench/env/lib/python3.12/site-packages/filelock/_api.py", line 279, in acquire
    raise Timeout(lock_filename)  # noqa: TRY301
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
filelock._error.Timeout: The file lock '/home/frappe/frappe-bench/config/bench_build.lock' could not be acquired.

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "<frozen runpy>", line 198, in _run_module_as_main
  File "<frozen runpy>", line 88, in _run_code
  File "/home/frappe/frappe-bench/apps/frappe/frappe/utils/bench_helper.py", line 114, in <module>
    main()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/utils/bench_helper.py", line 20, in main
    click.Group(commands=commands)(prog_name="bench")
  File "/home/frappe/frappe-bench/env/lib/python3.12/site-packages/click/core.py", line 1442, in __call__
    return self.main(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/frappe-bench/env/lib/python3.12/site-packages/click/core.py", line 1363, in main
    rv = self.invoke(ctx)
         ^^^^^^^^^^^^^^^^
  File "/home/frappe/frappe-bench/env/lib/python3.12/site-packages/click/core.py", line 1830, in invoke
    return _process_result(sub_ctx.command.invoke(sub_ctx))
                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/frappe-bench/env/lib/python3.12/site-packages/click/core.py", line 1830, in invoke
    return _process_result(sub_ctx.command.invoke(sub_ctx))
                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/frappe-bench/env/lib/python3.12/site-packages/click/core.py", line 1226, in invoke
    return ctx.invoke(self.callback, **ctx.params)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/frappe-bench/env/lib/python3.12/site-packages/click/core.py", line 794, in invoke
    return callback(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/frappe-bench/apps/frappe/frappe/commands/utils.py", line 63, in build
    with filelock("bench_build", is_global=True, timeout=10):
  File "/usr/lib/python3.12/contextlib.py", line 137, in __enter__
    return next(self.gen)
           ^^^^^^^^^^^^^^
  File "/home/frappe/frappe-bench/apps/frappe/frappe/utils/synchronization.py", line 45, in filelock
    raise LockTimeoutError(
frappe.utils.file_lock.LockTimeoutError: Failed to aquire lock: bench_build. Lock may be held by another process.<br>You can manually remove the lock if you think it's safe: /home/frappe/frappe-bench/config/bench_build.lock
ERROR: bench build --app erpnext
subprocess.CalledProcessError: Command 'bench build --app erpnext' returned non-zero exit status 1.

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/home/frappe/.local/bin/bench", line 7, in <module>
    sys.exit(cli())
             ^^^^^
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/cli.py", line 132, in cli
    bench_command()
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/commands/make.py", line 181, in get_app
    get_app(
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/app.py", line 781, in get_app
    app.install(verbose=verbose, skip_assets=skip_assets, restart_bench=restart_bench)
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/utils/render.py", line 126, in wrapper_fn
    return fn(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/app.py", line 253, in install
    install_app(
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/app.py", line 948, in install_app
    build_assets(bench_path=bench_path, app=app, using_cached=using_cached)
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/utils/bench.py", line 404, in build_assets
    exec_cmd(command, cwd=bench_path, env=env)
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/utils/__init__.py", line 184, in exec_cmd
    raise CommandFailedError(cmd) from subprocess.CalledProcessError(return_code, cmd)
bench.exceptions.CommandFailedError: bench build --app erpnext
```


---

Executed the command again.


