from pymongo import MongoClient, UpdateOne
import requests
import os
from dotenv import load_dotenv
from queue import Queue
import datetime as dt
from datetime import datetime, timedelta
from utils.runThreading import runThreading
from flask_restful import Resource, reqparse
from threading import Thread

##### Global DB Settings #####
load_dotenv()
CONNECTION_STRING = "mongodb+srv://{}:{}@thrifty.0xdedx2.mongodb.net/?retryWrites=true&w=majority"\
    .format(os.getenv('MONGODB_USER'), os.getenv('MONGODB_PASSWORD'))
db = MongoClient(CONNECTION_STRING).Thrifty
store_collection = db['store']
food_collection = db["food"]
meta_collection = db["meta"]


##### Family Mart #####
def threadingFamily():
    family_api = "https://stamp.family.com.tw/api/maps/MapProductInfo"
    headers = {
        'content-type': 'application/json', 
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
        }
    
    my_queue = Queue()
    for i in range(len(familyKeys)//200):
        my_queue.put(i)
    
    def func(i):
        p = {"OldPKeys":familyKeys[200*i:200*(i+1)],"PostInfo":"", "Latitude":0,"Longitude":0,"ProjectCode":"202106302"}
        store_infos = requests.post(family_api, headers=headers, json=p).json()['data']
        msgs = reformatFamily(store_infos)
        store_collection.bulk_write(msgs, ordered=False)
    
    runThreading(my_queue, func, 10)


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


def clearFamily():
    store_collection.update_many({"category": '全家'}, 
                                 {'$set': {'updateDate': datetime.utcnow()+timedelta(hours = 8), 'stocks': []}})



##### 7-11 #####
headers = {
    'host': 'lovefood.openpoint.com.tw', 
    'accept': 'application/json, text/plain, */*', 
    'origin': 'https://lovefood.openpoint.com.tw', 
    'connection': 'keep-alive', 
    'cookie': os.getenv('COOKIE'), 
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    'accept-language': 'zh-TW,zh-Hant;q=0.9', 
    'accept-encoding': 'gzip, deflate, br'
    }


## Get token
def getToken():
    token_api = "https://lovefood.openpoint.com.tw/LoveFood/api/Auth/FrontendAuth/AccessToken?mid_v={}"\
    .format(os.getenv('MID_V'))
    
    response = requests.post(token_api, headers=headers).json()
    if response['isSuccess'] == True:
        return response['element']
    return None

## get Store ID
def getStoreNum(token, Longitude, Latitude):
    nearby_api = f"https://lovefood.openpoint.com.tw/LoveFood/api/Search/FrontendStoreItemStock/GetNearbyStoreList?token={token}"
    json = {
        "SearchLocation" : {
            "Latitude" : Latitude,
            "Longitude" : Longitude
        },
        "CurrentLocation" : {
            "Latitude" : Latitude,
            "Longitude" : Longitude
        }
    }
    my_queue = Queue()
    stores = requests.post(nearby_api, headers=headers, json=json).json()
    if "element" in stores:
        for store in stores['element']['StoreStockItemList']:
            my_queue.put(store['StoreNo'])
        
    return my_queue


## reformat response
def reformatSeven(response):
    updateDate = datetime.strptime(response['StoreItemStockUpdateTime'], "%Y-%m-%dT%H:%M:%S")
    stocks = []
    for categoryBlock in response['StoreStockItem']['CategoryStockItems']:
        cat_name = categoryBlock['Name']
        for item in categoryBlock['ItemList']:
            name = item['ItemName'].replace('(區)', '')
            quantity = item['RemainingQty']
            if name not in sevenCats:
                msg = {
                    'tags': [cat_name]
                }
                if name in sevenPIDs:
                    food_collection.update_one({'name':name, 'brand':'7-11'}, {'$set':msg}, upsert=True)
                else:
                    msg['name'] = name
                    msg['brand'] = '7-11'
                    _id = food_collection.insert_one(msg).inserted_id
                    sevenPIDs[name] = _id
                sevenCats.add(name)

            _id = sevenPIDs[name]
            stocks.append({
                    '_id': _id,
                    'quantity': quantity,
                    'updateDate': updateDate
                })
    msg = {'updateDate':updateDate, 'stocks':stocks}
    return msg
    

## Main: Update Seven
def _updateSeven(Longitude, Latitude):
    global sevenPIDs
    global sevenCats

    meta_seven = meta_collection.find_one({'brand': "7-11"})
    sevenPIDs = meta_seven['sevenPIDs']
    sevenCats = set(meta_seven['sevenCats'])
    x = len(sevenPIDs)
    y = len(sevenCats)

    # get and check token
    token = getToken()
    if token == None:
        print('Token expired, please update token.')
        exit()
    
    # get nearby stores
    storeIDs = getStoreNum(token, Longitude, Latitude)
    
    # update database with threading
    food_api = f"https://lovefood.openpoint.com.tw/LoveFood/api/Search/FrontendStoreItemStock/GetStoreDetail?token={token}"
    
    def func(id):
        json = {
            "StoreNo": id,
            "CurrentLocation" : {
                "Latitude" : Latitude,
                "Longitude" : Longitude
            }
        }
        response = requests.post(food_api, headers=headers, json=json).json()
        if 'element' in response:
            msg = reformatSeven(response['element'])
            store_collection.update_one({'category': "7-11", 'original_id': id},{'$set': msg}, upsert=True)
        
    runThreading(storeIDs, func, 10)

    # update sevenPIDs
    if len(sevenPIDs) > x:
        meta_collection.update_one({'brand': "7-11"},{'$set':{'sevenPIDs':sevenPIDs}})

    # update sevenCats
    if len(sevenCats) > y:
        meta_collection.update_one({'brand': "7-11"},{'$set':{'sevenCats':list(sevenCats)}})


# check available time
def isNowInTimePeriod(): 
    nowTime = datetime.now().time()
    if dt.time(10,0) <= nowTime <= dt.time(17,0) or \
        dt.time(20,0) >= nowTime or dt.time(3,0) <= nowTime:
        return True
    return False

# API
class updateSeven (Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('Longitude', type=float, required=True, help='Longitude is required', location='json')
        self.parser.add_argument('Latitude', type=float, required=True, help='Latitude is required', location='json')
        
    def post(self):
        if isNowInTimePeriod():
            arg = self.parser.parse_args()
            t = Thread(target=_updateSeven, args=(arg['Longitude'], arg['Latitude']))
            t.start()
            return {
                'message': f"Updating 7-11 stores nearby {arg['Longitude']}, {arg['Latitude']}..."
            }
        return {
            'message': "Currently not in promoting time."
        }

def clearSeven():
    store_collection.update_many({"category": '7-11'}, 
                                 {'$set': {'updateDate': datetime.utcnow()+timedelta(hours = 8), 'stocks': []}})



if __name__ == "__main__":
    updateFamily()
    _updateSeven(120.964089, 24.799246)
    print('Test success!')