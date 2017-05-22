"""
Django settings for worksheet_project project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
ROOT_PATH = os.path.dirname(__file__)


try:
    from env import ENV_SETTINGS
except:
    ENV_SETTINGS = {}

PRODUCTION_ENV = True
if ENV_SETTINGS.get('DUCKSOUP_ENV') == 'localdev':
    PRODUCTION_ENV = False

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = ENV_SETTINGS.get('DJANGO_SECRET_KEY', 'x3w))_3q-qv3$bxaqz83$fcrh2gnt6rql6p7v*8=vw)%u*vn$b')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True


ADMINS = (
    # ('Your Name', 'your_email@example.com'),
    ('Robert Boyett', 'rdboyett@gmail.com'),
)

ALLOWED_HOSTS = ENV_SETTINGS.get('ALLOWED_HOSTS', ['*',])  # ['rdboyett.webfactional.com', 'ducksoup.us', 'www.ducksoup.us']


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'google_login',
    'google_drive',
    'classrooms',
    'contact_me',
    'userInfo_profile',
    'worksheet_creator',
    'beta_test',
    'tourBuilder',
    
    'paypal.standard.ipn',
    'payment_tracker',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'worksheet_project.urls'

WSGI_APPLICATION = 'worksheet_project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

if PRODUCTION_ENV:
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
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

if PRODUCTION_ENV:
    STATIC_URL = 'http://ducksoup.us/static/'
    STATIC_ROOT = '/home/rdboyett/webapps/static/'
else:
    STATIC_URL = '/static/'


TEMPLATE_DIRS = (os.path.join(ROOT_PATH,'templates'),)
STATICFILES_DIRS = (os.path.join(ROOT_PATH,'static'),)

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = os.path.join(BASE_DIR,'worksheet_creator','media')

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = '/media/'

LOGIN_URL          = '/'
LOGIN_REDIRECT_URL = '/dashboard/'
LOGIN_ERROR_URL    = '/google/error/'

EMAIL_HOST = 'smtp.webfaction.com'
EMAIL_HOST_USER = 'ducksoupwebmaster'
DEFAULT_FROM_EMAIL = 'webmaster@ducksoup.us'
SERVER_EMAIL = 'webmaster@ducksoup.us'
EMAIL_HOST_PASSWORD = ENV_SETTINGS.get('DUCKSOUP_EMAIL_PASSWORD')


PAYMENT_TRACKER_ON = False
PAYPAL_TEST = True
PAYPAL_RECEIVER_EMAIL = "rdboyett-facilitator@ducksoup.us"

if PRODUCTION_ENV:
    SITE_URL="http://ducksoup.us/"
else:
    SITE_URL="http://127.0.0.1:8000/"

if not PRODUCTION_ENV:
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': True,
        'formatters': {
            'standard': {
                'format' : "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
                'datefmt' : "%d/%b/%Y %H:%M:%S",
            },
        },
        'handlers': {
            'null': {
                'level':'DEBUG',
                'class':'django.utils.log.NullHandler',
            },
            'logfile': {
                'level':'DEBUG',
                'class':'logging.handlers.RotatingFileHandler',
                'filename': BASE_DIR + "/logfile",
                'maxBytes': 50000,
                'backupCount': 2,
                'formatter': 'standard',
            },
            'console':{
                'level':'INFO',
                'class':'logging.StreamHandler',
                'formatter': 'standard'
            },
        },
        'loggers': {
            'django': {
                'handlers':['console'],
                'propagate': True,
                'level':'WARN',
            },
            'django.db.backends': {
                'handlers': ['console'],
                'level': 'DEBUG',
                'propagate': False,
            },
            '': {
                'handlers': ['console', 'logfile'],
                'level': 'DEBUG',
                'propagate': False,
            },
        }
    }











