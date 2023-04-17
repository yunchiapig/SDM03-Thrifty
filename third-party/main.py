from updateDB import updateFamily
from apscheduler.schedulers.blocking import BlockingScheduler


if __name__ == "__main__":
    scheduler = BlockingScheduler(timezone="Asia/Taipei")
    scheduler.add_job(updateFamily, 'cron', minute='13,43')
    scheduler.start()