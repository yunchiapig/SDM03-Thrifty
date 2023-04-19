from updateDB import updateFamily, updateSeven, clearFamily, clearSeven
from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask
from flask_restful import Api

if __name__ == "__main__":
    scheduler = BackgroundScheduler(timezone="Asia/Taipei")
    scheduler.add_job(updateFamily, 'cron', hour='10-23', minute='13,43')
    scheduler.add_job(clearFamily, 'cron', hour='0')
    scheduler.add_job(clearSeven, 'cron', hour='3,17')
    scheduler.start()

    app = Flask(__name__)
    api = Api(app)
    api.add_resource(updateSeven, '/')
    app.run()