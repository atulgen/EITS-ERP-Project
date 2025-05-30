## Development environment

- Database: mariadb
    - user: frappe-dev
    - pass: frappe-dev

- Redis server
- Node


---





- Directory: eits-bench
    - bench: eits-dev
        - site: eits.local
            - Administrator Passsword: eits.local
            - Installed apps
                - ERPNext




---

## Issues

### Redis server not working: 

```bash
redis.exceptions.ConnectionError: Error 111 connecting to 127.0.0.1:11000. Connection refused.
```

#### Solution

```bash
redis-server --port 11000 --daemonize yes
```


### The CSS is broken in pages:
