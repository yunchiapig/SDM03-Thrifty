from updateDB import updateSeven
from flask import Flask
from flask_restful import Api

app = Flask(__name__)
api = Api(app)
api.add_resource(updateSeven, '/')

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)