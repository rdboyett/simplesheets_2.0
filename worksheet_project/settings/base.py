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

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, '..', 'db.sqlite3'),
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

STATIC_URL = '/static/'


TEMPLATE_DIRS = (os.path.join(BASE_DIR,'templates'),)
STATICFILES_DIRS = (os.path.join(BASE_DIR,'static'),)

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

SITE_URL="http://127.0.0.1:8000/"


TEMPLATES = [
    {
        # See: https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-TEMPLATES-BACKEND
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-dirs
        'DIRS': [
            os.path.join(BASE_DIR,'templates'),
        ],
        'OPTIONS': {
            # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-debug
            'debug': DEBUG,
            # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-loaders
            # https://docs.djangoproject.com/en/dev/ref/templates/api/#loader-types
            'loaders': [
                'django.template.loaders.filesystem.Loader',
                'django.template.loaders.app_directories.Loader',
            ],
            # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-context-processors
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]










