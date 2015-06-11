from django.conf.urls import patterns, include, url


urlpatterns = patterns('tourBuilder.views',
    (r'^countTour/$', 'countTour'),
    (r'^resetTour/$', 'resetTour'),
)