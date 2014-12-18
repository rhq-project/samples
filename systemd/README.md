## Managing RHQ with systemd

RHQ's runtime lifecycle can be successfully managed with systemd from version 4.14. The following steps should be enough to allow automatic restart of the services and automatically starting RHQ when the machine starts.

1. Edit the .service files and replace the path with the correct ones (ExecStart property)
2. Copy the files to ```/etc/systemd/system/```
3. Run ```systemctl daemon-reload```

To control the running system, use the following commands (with sudo):

* Start: ```systemctl start rhq-storage.service```
* Stop: ```systemctl stop rhq-storage.service```
* Check status: ```systemctl status rhq-storage.service```

The status command should show something like this:

```
[root@miranda rhq]# sudo systemctl status rhq-storage.service
● rhq-storage.service - RHQ Storage Node
   Loaded: loaded (/etc/systemd/system/rhq-storage.service; disabled)
   Active: active (running) since ti 2014-12-16 16:22:13 EET; 1 day 22h ago
 Main PID: 30332 (java)
   CGroup: /system.slice/rhq-storage.service
           ├─30332 /bin/java -Xmx512M -XX:MaxPermSize=128M -Djava.net.preferIPv4Stack=true -Dorg.jboss.resolver.warning=true -Djava.awt...
           └─30357 java -ea -javaagent:./../lib/jamm-0.2.5.jar -XX:+UseThreadPriorities -XX:ThreadPriorityPolicy=42 -Xms256M -Xmx256M -...

joulu 16 20:22:14 miranda rhqctl[30332]: INFO 20:22:14,368 Saved KeyCache (4563 items) in 67 ms
joulu 17 00:22:14 miranda rhqctl[30332]: INFO 00:22:14,392 Saved KeyCache (4563 items) in 90 ms
joulu 17 04:22:14 miranda rhqctl[30332]: INFO 04:22:14,379 Saved KeyCache (4563 items) in 78 ms
joulu 17 08:22:14 miranda rhqctl[30332]: INFO 08:22:14,355 Saved KeyCache (4563 items) in 54 ms
joulu 17 12:22:14 miranda rhqctl[30332]: INFO 12:22:14,399 Saved KeyCache (4563 items) in 98 ms
joulu 17 16:22:14 miranda rhqctl[30332]: INFO 16:22:14,345 Saved KeyCache (4563 items) in 43 ms
joulu 17 20:22:14 miranda rhqctl[30332]: INFO 20:22:14,365 Saved KeyCache (4563 items) in 62 ms
joulu 18 00:22:14 miranda rhqctl[30332]: INFO 00:22:14,382 Saved KeyCache (4563 items) in 79 ms
joulu 18 04:22:14 miranda rhqctl[30332]: INFO 04:22:14,378 Saved KeyCache (4563 items) in 74 ms
joulu 18 08:22:14 miranda rhqctl[30332]: INFO 08:22:14,413 Saved KeyCache (4563 items) in 109 ms
[root@miranda rhq]#
```

In the beginning there's system status (active or inactive) and in the end there's last log lines of the running service.
