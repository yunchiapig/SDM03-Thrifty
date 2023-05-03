import os
from gevent import monkey
monkey.patch_all()

bind='0.0.0.0:5000'
workers=4
daemon=False
worker_class="gevent"