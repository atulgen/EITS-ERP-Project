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


### Bench does not starts:

```bash
atuld@pop-os:~/Desktop/GennextIT/MEP-ERP/eits-bench/eits-dev$ bench start
10:06:51 system        | redis_cache.1 started (pid=63663)
10:06:51 system        | redis_queue.1 started (pid=63666)
10:06:51 system        | web.1 started (pid=63669)
10:06:51 system        | socketio.1 started (pid=63674)
10:06:51 system        | watch.1 started (pid=63679)
10:06:51 system        | schedule.1 started (pid=63682)
10:06:51 redis_queue.1 | 63671:C 30 May 2025 10:06:51.749 # Can't chdir to '/home/atuld/Desktop/GennextIT/MEP-ERP/frappe/eits-bench/eits-dev/config/pids': No such file or directory
10:06:51 redis_cache.1 | 63667:C 30 May 2025 10:06:51.749 # Can't chdir to '/home/atuld/Desktop/GennextIT/MEP-ERP/frappe/eits-bench/eits-dev/config/pids': No such file or directory
10:06:51 system        | worker.1 started (pid=63685)
10:06:51 system        | redis_queue.1 stopped (rc=1)
10:06:51 system        | sending SIGTERM to redis_cache.1 (pid 63663)
10:06:51 system        | sending SIGTERM to web.1 (pid 63669)
10:06:51 system        | sending SIGTERM to socketio.1 (pid 63674)
10:06:51 system        | sending SIGTERM to watch.1 (pid 63679)
10:06:51 system        | sending SIGTERM to schedule.1 (pid 63682)
10:06:51 system        | sending SIGTERM to worker.1 (pid 63685)
10:06:51 system        | redis_cache.1 stopped (rc=1)
10:06:51 system        | schedule.1 stopped (rc=-15)
10:06:51 system        | watch.1 stopped (rc=-15)
10:06:51 system        | worker.1 stopped (rc=-15)
10:06:51 system        | web.1 stopped (rc=-15)
10:06:51 system        | socketio.1 stopped (rc=-15)
```

### Bench starting issue:

```bash
atuld@pop-os:~/Desktop/GennextIT/MEP-ERP/frappe/eits-bench/eits-dev$ bench start
10:16:33 system        | redis_cache.1 started (pid=8277)
10:16:33 system        | redis_queue.1 started (pid=8280)
10:16:33 system        | web.1 started (pid=8283)
10:16:33 system        | socketio.1 started (pid=8288)
10:16:33 system        | watch.1 started (pid=8291)
10:16:33 system        | schedule.1 started (pid=8296)
10:16:33 redis_queue.1 | 8284:C 30 May 2025 10:16:33.945 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
10:16:33 redis_queue.1 | 8284:C 30 May 2025 10:16:33.945 # Redis version=6.0.16, bits=64, commit=00000000, modified=0, pid=8284, just started
10:16:33 redis_queue.1 | 8284:C 30 May 2025 10:16:33.945 # Configuration loaded
10:16:33 redis_cache.1 | 8281:C 30 May 2025 10:16:33.945 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
10:16:33 redis_cache.1 | 8281:C 30 May 2025 10:16:33.945 # Redis version=6.0.16, bits=64, commit=00000000, modified=0, pid=8281, just started
10:16:33 redis_cache.1 | 8281:C 30 May 2025 10:16:33.945 # Configuration loaded
10:16:33 redis_queue.1 | 8284:M 30 May 2025 10:16:33.946 * Increased maximum number of open files to 10032 (it was originally set to 1024).
10:16:33 redis_cache.1 | 8281:M 30 May 2025 10:16:33.946 * Increased maximum number of open files to 10032 (it was originally set to 1024).
10:16:33 redis_queue.1 | 8284:M 30 May 2025 10:16:33.946 # Could not create server TCP listening socket 127.0.0.1:11000: bind: Address already in use
10:16:33 system        | worker.1 started (pid=8299)
10:16:33 redis_cache.1 | 8281:M 30 May 2025 10:16:33.947 * Running mode=standalone, port=13000.
10:16:33 redis_cache.1 | 8281:M 30 May 2025 10:16:33.947 # Server initialized
10:16:33 redis_cache.1 | 8281:M 30 May 2025 10:16:33.947 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
10:16:33 system        | redis_queue.1 stopped (rc=1)
10:16:33 system        | sending SIGTERM to redis_cache.1 (pid 8277)
10:16:33 system        | sending SIGTERM to web.1 (pid 8283)
10:16:33 system        | sending SIGTERM to socketio.1 (pid 8288)
10:16:33 system        | sending SIGTERM to watch.1 (pid 8291)
10:16:33 system        | sending SIGTERM to schedule.1 (pid 8296)
10:16:33 system        | sending SIGTERM to worker.1 (pid 8299)
10:16:33 redis_cache.1 | 8281:M 30 May 2025 10:16:33.948 * Ready to accept connections
10:16:33 redis_cache.1 | 8281:signal-handler (1748580393) Received SIGTERM scheduling shutdown...
10:16:33 system        | worker.1 stopped (rc=-15)
10:16:33 system        | schedule.1 stopped (rc=-15)
10:16:33 system        | watch.1 stopped (rc=-15)
10:16:33 system        | web.1 stopped (rc=-15)
10:16:33 system        | socketio.1 stopped (rc=-15)
10:16:34 redis_cache.1 | 8281:M 30 May 2025 10:16:34.049 # User requested shutdown...
10:16:34 redis_cache.1 | 8281:M 30 May 2025 10:16:34.049 * Removing the pid file.
10:16:34 redis_cache.1 | 8281:M 30 May 2025 10:16:34.049 # Redis is now ready to exit, bye bye...
10:16:34 system        | redis_cache.1 stopped (rc=-15)
```

