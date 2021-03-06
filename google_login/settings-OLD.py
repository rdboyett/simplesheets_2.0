import os
ROOT_PATH = os.path.dirname(__file__)

from django.conf import settings

#place your goole client_secrects.json download in the same directory as this file.
CLIENT_SECRETS = os.path.join(ROOT_PATH,'..', 'secrets', 'client_secrets.json')

#Add any scopes that you want access to in the credentials file
SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive.install',
    'https://www.googleapis.com/auth/drive.metadata',
    'https://www.googleapis.com/auth/drive',
    # Add other requested scopes.
]

#Change the redirect uri for your project
if getattr(settings, 'PRODUCTION_ENV', False):
    redirect_uri='http://ducksoup.us/google/oauth2callback'
elif settings.ENV_SETTINGS.get('redirect_uri'):
    redirect_uri = settings.ENV_SETTINGS.get('redirect_uri')
else:
    redirect_uri='http://127.0.0.1:8000/google/oauth2callback'

#Login Success redirect
LOGIN_SUCCESS = '/dashboard/'

#change to any random hashed sequence
SECRET_KEY = 't(641aasfrv6^^-1sj$uzq(fskmd%+!33199$axb1hu(2i_2n='

#make sure this email is matched up to the project email settings.py
WEBMASTER_EMAIL = getattr(settings, 'SERVER_EMAIL', 'rdboyett@gmail.com')

WEBSITENAME = 'www.ducksoup.us'

ROOT_WEBSITE_LINK = getattr(settings, 'SITE_URL', 'http://ducksoup.us/')


BETA_TEST_ON = False