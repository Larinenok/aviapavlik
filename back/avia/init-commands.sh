#! /bin/bash

python3 manage.py collectstatic --noinput
python3 manage.py makemigrations --noinput
python3 manage.py migrate --noinput
# uwsgi --ini /etc/uwsgi.ini
# python3 manage.py runserver 0.0.0.0:8001
daphne -b 0.0.0.0 -p 8000 avia.asgi:application
