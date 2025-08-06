## Issue:

```bash
frappe@ip-172-31-13-85:~/frappe-bench$ bench start
ERROR: No process manager found
Traceback (most recent call last):
  File "/home/frappe/.local/bin/bench", line 7, in <module>
    sys.exit(cli())
             ^^^^^
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/cli.py", line 132, in cli
    bench_command()
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/click/core.py", line 1442, in __call__
    return self.main(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/click/core.py", line 1363, in main
    rv = self.invoke(ctx)
         ^^^^^^^^^^^^^^^^
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/click/core.py", line 1830, in invoke
    return _process_result(sub_ctx.command.invoke(sub_ctx))
                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/click/core.py", line 1226, in invoke
    return ctx.invoke(self.callback, **ctx.params)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/click/core.py", line 794, in invoke
    return callback(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/commands/utils.py", line 22, in start
    start(
  File "/home/frappe/.local/share/pipx/venvs/frappe-bench/lib/python3.12/site-packages/bench/utils/system.py", line 152, in start
    raise Exception("No process manager found")
Exception: No process manager found

```



---


