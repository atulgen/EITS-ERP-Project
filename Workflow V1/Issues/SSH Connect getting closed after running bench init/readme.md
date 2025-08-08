## Issue:

```bash
frappe@ip-172-31-13-85:~$ bench init --frappe-branch version-15 frappe-bench
Setting Up Environment
$ python3 -m venv env
$ /home/frappe/frappe-bench/env/bin/python -m pip install --quiet --upgrade pip
$ /home/frappe/frappe-bench/env/bin/python -m pip install --quiet wheel
Getting frappe
$ git clone https://github.com/frappe/frappe.git --branch version-15 --depth 1 --origin upstream
Cloning into 'frappe'...
remote: Enumerating objects: 3348, done.
remote: Counting objects: 100% (3348/3348), done.
remote: Compressing objects: 100% (3013/3013), done.
Receiving objects: 100% (3348/3348), 16.58 MiB | 11.83 MiB/s, done.
remote: Total 3348 (delta 408), reused 1969 (delta 222), pack-reused 0 (from 0)
Resolving deltas: 100% (408/408), done.
Installing frappe
$ /home/frappe/frappe-bench/env/bin/python -m pip install --quiet --upgrade -e /home/frappe/frappe-bench/apps/frappe 
$ yarn install --check-files
yarn install v1.22.22
[1/5] Validating package.json...
[2/5] Resolving packages...
[3/5] Fetching packages...
[4/5] Linking dependencies...
warning " > @frappe/esbuild-plugin-postcss2@0.1.3" has unmet peer dependency "less@^4.x".
warning " > @frappe/esbuild-plugin-postcss2@0.1.3" has unmet peer dependency "stylus@^0.x".
warning " > @vue/component-compiler@4.2.4" has unmet peer dependency "vue-template-compiler@*".
[5/5] Building fresh packages...
Done in 17.88s.
Found existing apps updating states...
$ sudo supervisorctl restart frappe:
frappe: ERROR (no such group)
frappe: ERROR (no such group)
WARN: restarting supervisor group `frappe:` failed. Use `bench restart` to retry.
$ bench build
Assets for Release v15.75.0 don't exist
✔ Application Assets Linked                                                                                                                                                     


yarn run v1.22.22
$ node esbuild --production --run-build-command
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
```

It is stuck in this section 

---

Force Quit the process let's see how it goes.