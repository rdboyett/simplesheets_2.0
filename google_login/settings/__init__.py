try:
    from env import ENV_SETTINGS
except:
    ENV_SETTINGS = {}

environment = ENV_SETTINGS.get('DUCKSOUP_ENV', 'localdev')

if environment == 'production':
    from .production import *
elif environment == 'stage':
    from .stage import *
elif environment == 'localdev':
    from .localdev import *