from django.conf.urls.defaults import *

import settings
print settings.CSS_PATH
print settings.JAVASCRIPT_PATH

urlpatterns = patterns('',
    (r'', include('yaploud2.home.urls')),
    (r'^login/', include('yaploud2.login.urls')),
    (r'^chat/', include('yaploud2.chat.urls')),

    (r'^scripts/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.JAVASCRIPT_PATH}),
    (r'^styles/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.CSS_PATH}),
    (r'^images/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.IMAGES_PATH}),


    (r'^static/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.STATIC_PATH}),
    # Example:
    # (r'^yaploud2/', include('yaploud2.foo.urls')),

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs' 
    # to INSTALLED_APPS to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # (r'^admin/(.*)', admin.site.root),
)
