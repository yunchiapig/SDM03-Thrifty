# Third-party

## Information
Maintaining **Family-mart** and **7-11** lovefood API for Thrifty, which sends requests to get latest lovefood stock information and updates to MongoDB Atlas. This project is non-profit and once a warning is received, the service will be terminated immediately.

## Structure
There are two sub-services in the application, `main.py` and `app.py`, **multi-threading** is used to enhacne efficiency and **supervisor** is used to supervise processes in docker container.

### main.py
This service regularly sends requests to run `updateFamily`, `clearFamily` and `clearSeven` through **apscheduler**.

### app.py
This service hosts daemon to run `updateSeven` through **Flask-RESTful** and uses **gunicorn**+**gevent** for WSGI. User sends post requests with their Longitude and Latitude, the service will update stores neayby user.
* Example Payload
```json
Payload = {
    "Longitude" : 120.964089,
    "Latitude" : 24.799246
    }
```

## Usage
An `.env` file is needed to properly run the services:
```
MONGODB_USER = 'MongoDB Atlas User'
MONGODB_PASSWORD = 'MongoDB Atlas Password'
MID_V = 'Opne Point APP Token'
COOKIE = 'Opne Point APP Cookie'
``` 
You should mock your own Opne Point APP to get `MID_V` and `COOKIE`.

### Run in Python Virtual Environment
* To start
```shell
cd third-party
pip install virtualenv
python3 -m venv .
source bin/activate
pip install -r requirements.txt
supervisord -c supervisord.conf
```
* To stop
```shell
pkill -f supervisord
deactivate
```

### Run in Docker container
* To start
```shell
cd third-party
docker build -t third-party . --no-cache
docker run -it --name third-party -p 5000:5000 third-party
```
* To stop
```shell
docker stop third-party
```

You can check the result in http://127.0.0.1:5000, to be emphasized, you should use post method to run `updateSeven`.


## Nginx
You can use nginx for reversed proxy, the config setting looks like this.
```
server {
    listen 80;
    server_name _;

    location /third-party {
        proxy_pass http://127.0.0.1:5000/;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Prefix /;
    }
}
```





