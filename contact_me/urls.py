from django.conf.urls import patterns, include, url

urlpatterns = patterns('contact_me.views',
    (r'^$', 'contact'),
)
