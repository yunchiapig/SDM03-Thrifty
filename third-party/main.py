from updateDB import updateFamily, clearFamily, clearSeven
from apscheduler.schedulers.blocking import BlockingScheduler
from pytz import timezone

tz = timezone('Asia/Taipei')
scheduler = BlockingScheduler(timezone=tz)
scheduler.add_job(updateFamily, 'cron', hour='10-23', minute='13,43')
scheduler.add_job(clearFamily, 'cron', hour='0')
# scheduler.add_job(clearSeven, 'cron', hour='3,17')

if __name__ == "__main__":
    scheduler.start()