from GUMA_investimentos.settings import *

# template to create local_settings.py in order to not share secret configs
# override only local changes such as databases
# run with makefile

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'guma_financas',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}