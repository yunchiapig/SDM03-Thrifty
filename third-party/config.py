import os
from gevent import monkey
monkey.patch_all()

bind='127.0.0.1:5000'
workers=4
daemon=True
worker_class="gevent"