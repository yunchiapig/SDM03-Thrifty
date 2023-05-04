FROM python:3.10.6-alpine

WORKDIR /third-party

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /var/log && touch /var/log/scheduler.log && touch /var/log/flask.log 


EXPOSE 5000

CMD supervisord -c supervisord.conf
