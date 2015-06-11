This is a simple tour app that allows you to create tours on your pages

add to settings.py:
    'tourBuilder',
    
    
add to urls.py:
    url(r'^tour/', include('tourBuilder.urls')),