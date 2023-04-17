from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
CONNECTION_STRING = "mongodb+srv://{}:{}@thrifty.0xdedx2.mongodb.net/?retryWrites=true&w=majority"\
    .format(os.getenv('MONGODB_USER'), os.getenv('MONGODB_PASSWORD'))
meta_collection = MongoClient(CONNECTION_STRING).Thrifty["meta"]
meta_collection.insert_one({'brand':"全家",
                            'familyKeys':[],
                            'familyPIDs':{}
                            })
meta_collection.insert_one({'brand':"7-11",
                            'sevenKeys':[],
                            'sevenPIDs':{}
                            })