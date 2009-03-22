from django.conf.urls.defaults import *

urlpatterns = patterns('yaploud2.chat.views',
    (r'^$', 'index'),
    (r'^sendMessage/$', 'sendMessage'),
    (r'^getMessages/$', 'getMessages'),
    (r'^getMessages/(?P<message_id>\d+)$', 'getMessages'),
)
