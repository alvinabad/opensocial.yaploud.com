#!/bin/sh

python manage.py syncdb
sudo /sbin/service httpd restart
#tail -f /var/log/httpd/error_log
tail -f /home/yaploud/logs/ning.yaploud.com/error_log
