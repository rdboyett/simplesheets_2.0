from .base import *


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'ducksoupbeta',
        'USER': 'rdboyett',
        'PASSWORD': 'dallas20',
        'HOST': '',
        'PORT': '',
    }
}

ALLOWED_HOSTS = ['rdboyett.webfactional.com', 'ducksoup.us', 'www.ducksoup.us']

STATIC_URL = 'http://ducksoup.us/static/'
STATIC_ROOT = '/home/rdboyett/webapps/static/'

SITE_URL="http://ducksoup.us/"