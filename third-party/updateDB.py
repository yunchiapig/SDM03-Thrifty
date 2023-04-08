from pymongo import MongoClient, InsertOne, UpdateOne
import requests
import pickle
import os
from dotenv import load_dotenv
import threading
import queue

# Global Settings
load_dotenv()
CONNECTION_STRING = "mongodb+srv://{}:{}@thrifty.0xdedx2.mongodb.net/?retryWrites=true&w=majority"\
    .format(os.getenv('MONGODB_USER'), os.getenv('MONGODB_PASSWORD'))
db = MongoClient(CONNECTION_STRING).Thrifty
store_collection = db['store']
food_collection = db["food"]


def threadingFamily():
    family_api = "https://stamp.family.com.tw/api/maps/MapProductInfo"
    headers = {
        'content-type': 'application/json', 
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
        }

    updateDate = ['']

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
                if updateDate[0] == '' and store_infos != []:
                    updateDate[0] = store_infos[0]['updateDate']
    
    my_queue = queue.Queue()
    for i in range(len(familyKeys)//200):
        my_queue.put(i)
    
    workers = [Worker(my_queue) for _ in range(4)]
    for worker in workers:
        worker.start()
    for worker in workers:
        worker.join()

    return updateDate[0]


def reformatFamily(store_infos):
    msgs = []

    for data in store_infos:
        stocks = []
        updateDate = data['updateDate']
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
                    'updateDate': updateDate
                })
        
        id = data['oldPKey']
        if id in familyIDs:
            msg = UpdateOne({"original_id": data['oldPKey'], 'category': '全家'}, 
                            {'$set': {'updateDate': updateDate, 'stocks': stocks}}, upsert=True)
        else:
            store = {
                'original_id': id,
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
            msg = InsertOne(store)
            familyIDs.add(id)
            
        msgs.append(msg)
    
    return msgs

def updateFamily():
    global familyKeys
    global familyIDs
    global familyPIDs

    # load familyKeys
    if os.path.isfile('utils/familyKeys.pickle'):
        with open("utils/familyKeys.pickle", "rb") as f:
            familyKeys = pickle.load(f)
    else:
        familyKeys = []

    # load familyIDs
    if os.path.isfile('utils/familyIDs.pickle'):
        with open("utils/familyIDs.pickle", "rb") as f:
            familyIDs = pickle.load(f)
    else:
        familyIDs = set()

    # load familyPIDs
    if os.path.isfile('utils/familyPIDs.pickle'):
        with open('utils/familyPIDs.pickle', 'rb') as f:
            familyPIDs = pickle.load(f)
    else:
        familyPIDs = {}

    # update
    updateDate = threadingFamily()
    store_collection.update_many({"category": '全家', "updateDate": {"$ne": updateDate}}, 
                                 {'$set': {'updateDate': updateDate, 'stocks': []}})

    # save familyPIDs
    with open('utils/familyIDs.pickle', 'wb') as f:
        pickle.dump(familyIDs, f)

    # save familyPIDs
    with open('utils/familyPIDs.pickle', 'wb') as f:
        pickle.dump(familyPIDs, f)


if __name__ == "__main__":
    updateFamily()
    print('test success!')