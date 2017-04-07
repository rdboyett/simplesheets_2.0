from .base import *

DATABASE_SETTINGS = ENV_SETTINGS.get('DATABASE_SETTINGS', {})

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': DATABASE_SETTINGS.get('NAME', ''),
        'USER': DATABASE_SETTINGS.get('USER', ''),
        'PASSWORD': DATABASE_SETTINGS.get('PASSWORD', ''),
        'HOST': '',
        'PORT': '',
    }
}

ALLOWED_HOSTS = ['rdboyett.webfactional.com', 'ducksoup.us', 'www.ducksoup.us']

STATIC_URL = 'http://ducksoup.us/static/'
STATIC_ROOT = '/home/rdboyett/webapps/static/'

SITE_URL="http://ducksoup.us/"