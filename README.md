
# Getting started

### Install Dependencies

1. Install global dependencies

        sudo easy_install virtualenv virtualenvwrapper

1. Run setup script

        ./setup <app_name> dev

        ##Examples:
        ./setup ducksoup dev

        The 'dev' is for future environment setup

### Run

1. Activate virtualenv

        source activate-<app_name>

        ##Examples:
        source activate-ducksoup

1. Run Django

        python manage.py runserver

1. Open your browser and go to [http://localhost:8000].

### Clean Up

1. Whenever you want to clean up and start fresh, either recheckout the repo, or run the following:

        git clean -xdf
        git reset --hard
