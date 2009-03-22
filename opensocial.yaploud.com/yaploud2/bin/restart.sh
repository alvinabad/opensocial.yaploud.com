#!/bin/sh

python manage.py syncdb
sudo /sbin/service httpd restart

