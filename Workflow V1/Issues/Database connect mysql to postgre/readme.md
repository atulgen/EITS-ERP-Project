```bash
-31-13-85:~/frappe-bench$ bench new-site erp.eitsdubai.com
MySQL root password: 




Traceback (most recent call last):
  File "/home/frappe/frappe-bench/env/lib/python3.12/site-packages/pymysql/connections.py", line 649, in connect
    sock = socket.create_connection(
           ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/lib/python3.12/socket.py", line 852, in create_connection
    raise exceptions[0]
  File "/usr/lib/python3.12/socket.py", line 837, in create_connection
    sock.connect(sa)
OSError: [Errno 101] Network is unreachable

During handling of the above exception, another exception occurred:

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
  File "/home/frappe/frappe-bench/apps/frappe/frappe/commands/site.py", line 105, in new_site
    _new_site(
  File "/home/frappe/frappe-bench/apps/frappe/frappe/installer.py", line 90, in _new_site
    install_db(
  File "/home/frappe/frappe-bench/apps/frappe/frappe/installer.py", line 170, in install_db
    setup_database(force, verbose, mariadb_user_host_login_scope)
  File "/home/frappe/frappe-bench/apps/frappe/frappe/database/__init__.py", line 21, in setup_database
    return frappe.database.mariadb.setup_db.setup_database(force, verbose, mariadb_user_host_login_scope)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/frappe-bench/apps/frappe/frappe/database/mariadb/setup_db.py", line 32, in setup_database
    if force or (db_name not in dbman.get_database_list()):
                                ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/frappe-bench/apps/frappe/frappe/database/db_manager.py", line 50, in get_database_list
    return self.db.sql("SHOW DATABASES", pluck=True)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/frappe-bench/apps/frappe/frappe/database/database.py", line 207, in sql
    self.connect()
  File "/home/frappe/frappe-bench/apps/frappe/frappe/database/database.py", line 112, in connect
    self._conn: "MariadbConnection" | "PostgresConnection" = self.get_connection()ab
                                                             ^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/frappe-bench/apps/frappe/frappe/database/mariadb/database.py", line 108, in get_connection
    conn = self._get_connection()
           ^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/frappe-bench/apps/frappe/frappe/database/mariadb/database.py", line 114, in _get_connection
    return self.create_connection()
           ^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/frappe-bench/apps/frappe/frappe/database/mariadb/database.py", line 117, in create_connection
    return pymysql.connect(**self.get_connection_settings())
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/frappe/frappe-bench/env/lib/python3.12/site-packages/pymysql/connections.py", line 361, in __init__
    self.connect()
  File "/home/frappe/frappe-bench/env/lib/python3.12/site-packages/pymysql/connections.py", line 716, in connect
    raise exc
pymysql.err.OperationalError: (2003, "Can't connect to MySQL server on 'ep-mute-fog-a1ksi8qu-pooler.ap-southeast-1.aws.neon.tech' ([Errno 101] Network is unreachable)")
frappe@ip-172-31-13-85:~/frappe-bench$ 
```

---

Looking at your error, Frappe is trying to connect to a MySQL/MariaDB server on Neon, but Neon is a PostgreSQL service. The core issue is that Frappe/ERPNext doesn't support PostgreSQL - it only works with MySQL/MariaDB.

