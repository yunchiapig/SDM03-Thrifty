from pymongo import MongoClient
import requests
import pickle
import os
from dotenv import load_dotenv
import threading
import queue

# global settings
load_dotenv()
CONNECTION_STRING = "mongodb+srv://{}:{}@thrifty.0xdedx2.mongodb.net/?retryWrites=true&w=majority"\
    .format(os.getenv('MONGODB_USER'), os.getenv('MONGODB_PASSWORD'))


def requestFamily(familyKeys):
    family_api = "https://stamp.family.com.tw/api/maps/MapProductInfo"
    headers = {
        'content-type': 'application/json', 
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
        }
    store_infos = []
    
    class Worker(threading.Thread):
        def __init__(self, queue):
            threading.Thread.__init__(self)
            self.queue = queue

        def run(self):
            while self.queue.qsize() > 0:
                i = self.queue.get()
                p = {"OldPKeys":familyKeys[200*i:200*(i+1)],"PostInfo":"", "Latitude":0,"Longitude":0,"ProjectCode":"202106302"}
                raw_response = requests.post(family_api, headers = headers, json = p).json()['data']
                store_infos.extend(raw_response)
    
    my_queue = queue.Queue()
    for i in range(len(familyKeys)//200):
        my_queue.put(i)
    
    workers = [Worker(my_queue) for _ in range(4)]
    for worker in workers:
        worker.start()
    for worker in workers:
        worker.join()

    # for i in range(len(familyKeys)//200):
    #     p = {"OldPKeys":familyKeys[200*i:200*(i+1)],"PostInfo":"","Latitude":0,"Longitude":0,"ProjectCode":"202106302"}
    #     raw_response = requests.post(family_api, headers = headers, json = p).json()['data']
    #     store_infos.extend(raw_response)
    return store_infos



def reformatFamily(store_infos, familyPIDs):
    new_foods = []
    stores = []

    for data in store_infos:
        stocks = []
        updateDate = data['updateDate']

        # food info
        category = data['info'][0]['name']
        for foods in data['info'][0]['categories']:
            tag = foods['name']
            for prod in foods['products']:
                pid = "family" + prod['code']
                stocks.append({
                    '_id': pid,
                    'quantity': prod['qty'],
                    'updateDate': updateDate
                })
                if pid not in familyPIDs:
                    food = {
                        '_id': pid,
                        'name': prod['name'],
                        'category': category,
                        'tag': [tag],
                        'original_price' : 0,
                        'discount_price' : 0
                    }
                    new_foods.append(food)
                    familyPIDs.add(pid)
            
            
        # store info
        store = {
            '_id': "family" + data['oldPKey'],
            'name': data['name'],
            'category': '全家',
            'tel': data['tel'],
            'address': data['address'],
            'location': {
                'type': 'Point', 
                'coordinates':[data['longitude'], data['latitude']]
                },
            'updateDate': updateDate,
            'stocks': stocks
        }

        stores.append(store)
    return new_foods, stores, familyPIDs


def updateFamily():
    # connect to DB
    client = MongoClient(CONNECTION_STRING)
    db = client.Thrifty
    store_collection = db['store']

    # load food catalog
    if os.path.isfile('familyPIDs.pickle'):
        with open('familyPIDs.pickle', 'rb') as f:
            familyPIDs = pickle.load(f)
    else:
        familyPIDs = set()

    # load familyKeys
    if os.path.isfile('familyKeys.pickle'):
        with open("familyKeys.pickle", "rb") as f:
            familyKeys = pickle.load(f)
    else:
        familyKeys = []

    # request family api
    store_infos = requestFamily(familyKeys)

    # reformat raw result
    new_foods, stores, familyPIDs = reformatFamily(store_infos, familyPIDs)

    # update DB
    store_collection.delete_many({"_id": {"$regex": "family"}})
    if stores:
        store_collection.insert_many(stores)
    if new_foods:
        food_collection = db["food"]
        food_collection.insert_many(new_foods)

    # save food catalog
    with open('familyPIDs.pickle', 'wb') as f:
        pickle.dump(familyPIDs, f)