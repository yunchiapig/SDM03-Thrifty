from pymongo import MongoClient, UpdateOne
import requests
import os
from dotenv import load_dotenv
import threading
from queue import Queue
from datetime import datetime

# Global Settings
load_dotenv()
CONNECTION_STRING = "mongodb+srv://{}:{}@thrifty.0xdedx2.mongodb.net/?retryWrites=true&w=majority"\
    .format(os.getenv('MONGODB_USER'), os.getenv('MONGODB_PASSWORD'))
db = MongoClient(CONNECTION_STRING).Thrifty
store_collection = db['store']
food_collection = db["food"]
meta_collection = db["meta"]


def threadingFamily():
    family_api = "https://stamp.family.com.tw/api/maps/MapProductInfo"
    headers = {
        'content-type': 'application/json', 
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
        }
    class Worker(threading.Thread):
        def __init__(self, queue):
            threading.Thread.__init__(self)
            self.queue = queue

        def run(self):
            while self.queue.qsize() > 0:
                i = self.queue.get()
                p = {"OldPKeys":familyKeys[200*i:200*(i+1)],"PostInfo":"", "Latitude":0,"Longitude":0,"ProjectCode":"202106302"}
                store_infos = requests.post(family_api, headers=headers, json=p).json()['data']
                msgs = reformatFamily(store_infos)
                store_collection.bulk_write(msgs, ordered=False)
    
    my_queue = Queue()
    for i in range(len(familyKeys)//200):
        my_queue.put(i)
    
    workers = [Worker(my_queue) for _ in range(4)]
    for worker in workers:
        worker.start()
    for worker in workers:
        worker.join()


def reformatFamily(store_infos):
    msgs = []

    for data in store_infos:
        stocks = []
        if familyDate[0] == '':
            familyDate[0] = datetime.strptime(data['updateDate'], "%Y-%m-%dT%H:%M:%S%z")
        category = data['info'][0]['name']

        for foods in data['info'][0]['categories']:
            tag = foods['name']

            for prod in foods['products']:
                pid = prod['code']
                if pid in familyPIDs:
                    _id = familyPIDs[pid]
                else:
                    food = {
                        'original_id': pid,
                        'brand': '全家',
                        'name': prod['name'],
                        'category': category,
                        'tag': [tag],
                        'original_price' : 0,
                        'discount_price' : 0
                    }

                    _id = food_collection.insert_one(food).inserted_id
                    familyPIDs[pid] = _id
                    
                stocks.append({
                    '_id': _id,
                    'quantity': prod['qty'],
                    'updateDate': familyDate[0]
                })
            
        msgs.append(UpdateOne({"original_id": data['oldPKey'], 'category': '全家'}, 
                        {'$set': {'updateDate': familyDate[0], 'stocks': stocks}}, upsert=True))
    
    return msgs

def updateFamily():
    global familyKeys
    global familyPIDs
    global familyDate
    
    # load family meta data
    meta_family = meta_collection.find_one({'brand': "全家"})
    familyKeys = meta_family['familyKeys']
    familyPIDs = meta_family['familyPIDs']
    n = len(familyPIDs)
    familyDate = ['']

    # update
    threadingFamily()
    store_collection.update_many({"category": '全家', "updateDate": {"$ne": familyDate[0]}}, 
                                 {'$set': {'updateDate': familyDate[0], 'stocks': []}})

    # update familyPIDs
    if len(familyPIDs) > n:
        meta_collection.update_one({'brand': "全家"},{'$set':{'familyPIDs':familyPIDs}})


if __name__ == "__main__":
    updateFamily()
    print('Test success!')