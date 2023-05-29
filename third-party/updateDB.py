from pymongo import MongoClient, UpdateOne
import requests
import os
from dotenv import load_dotenv
from queue import Queue
import datetime as dt
from datetime import datetime, timedelta
from utils.runThreading import runThreading
from utils.sevenCats import sevenCats
from flask_restful import Resource, reqparse
from threading import Thread
import logging
from threading import Lock
import re


##### Global DB Settings #####
load_dotenv()
CONNECTION_STRING = "mongodb+srv://{}:{}@thrifty.0xdedx2.mongodb.net/?retryWrites=true&w=majority"\
    .format(os.getenv('MONGODB_USER'), os.getenv('MONGODB_PASSWORD'))
db = MongoClient(CONNECTION_STRING).Thrifty
store_collection = db['store']
food_collection = db["food"]
meta_collection = db["meta"]
sevenPrices = meta_collection.find_one({'brand':'7-11'})['sevenPrices']
logging.basicConfig(format='[%(asctime)s +0000] [%(filename)s] [%(levelname)s] %(message)s', datefmt='%Y-%m-%d %H:%M:%S', level=logging.INFO)


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
    
    runThreading(my_queue, func, os.cpu_count())
    logging.info("Family-mart updated.")


def reformatFamily(store_infos):
    msgs = []

    for data in store_infos:  # for each store
        stocks = []

        for cat in data['info']:  # for each category
            category = cat['name']

            for sub_cat in cat['categories']:  # for each sub-category (tags)
                tags = sub_cat['name']

                for prod in sub_cat['products']:  # for each food (prduct)
                    pid = prod['code']
                    #
                    familyLock.acquire() # enhance thread safety
                    #
                    if pid not in familyPIDs:
                        food = {
                            'original_id': pid,
                            'brand': '全家',
                            'name': prod['name'],
                            'category': category,
                            'tags': [tags],
                            'original_price' : 0,
                            'discount_price' : 0,
                            'discount_rate' : '7折',
                            'img_url': f'https://prod-aim.azurewebsites.net/AIM/C0000000{pid}.jpg'
                        }
                        familyPIDs[pid] = food_collection.insert_one(food).inserted_id
                    #
                    familyLock.release() # enhance thread safety
                    #

                    stocks.append({
                        '_id': familyPIDs[pid],
                        'quantity': prod['qty'],
                        'updateDate': familyDate
                    })
            
        msgs.append(UpdateOne({"original_id": data['oldPKey'], 'category': '全家'}, 
                        {'$set': {'updateDate': familyDate, 'stocks': stocks}}, upsert=True))
    
    return msgs

def updateFamily():
    global familyKeys
    global familyPIDs
    global familyDate
    global familyLock
    
    # load family meta data
    meta_family = meta_collection.find_one({'brand': "全家"})
    familyKeys = meta_family['familyKeys']
    familyPIDs = meta_family['familyPIDs']
    n = len(familyPIDs)
    familyDate = datetime.utcnow()+timedelta(hours = 8)
    familyLock = Lock()

    # update
    threadingFamily()
    store_collection.update_many({"category": '全家', "updateDate": {"$ne": familyDate}}, 
                                 {'$set': {'updateDate': familyDate, 'stocks': []}})

    # update familyPIDs
    if len(familyPIDs) > n:
        meta_collection.update_one({'brand': "全家"},{'$set':{'familyPIDs':familyPIDs}})
        logging.info(f"Update {len(familyPIDs)-n} familyPIDs")


def clearFamily():
    store_collection.update_many({"category": '全家'}, 
                                 {'$set': {'updateDate': datetime.utcnow()+timedelta(hours = 8), 'stocks': []}})
    logging.info("Family-mart cleared.")



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


def regex(s):
    return re.sub('\(\w\)|\w\)\w\)| |★', '', s)

## reformat response
def reformatSeven(response):
    stocks = []
    for categoryBlock in response['StoreStockItem']['CategoryStockItems']:
        tag_name = categoryBlock['Name']
        cat_name = sevenCats.get(tag_name, '其他')
        for item in categoryBlock['ItemList']:
            name = regex(item['ItemName'])
            quantity = item['RemainingQty']
            #
            sevenLock.acquire() # enhance thread safety
            #
            if name not in sevenPIDs:
                msg = {
                    'name':name,
                    'brand':'7-11',
                    'category': cat_name,
                    'tags': [tag_name],
                    'original_price': 0,
                    'discount_price': 0,
                    'discount_rate': '65折',
                    'img_url' : 'https://corp.7-eleven.com/images/media_assets/7_Eleven_Vertical_2022_RBG_thumb_1639377127_5694.png'
                }
                if name in sevenPrices:
                    msg =  {**msg, **sevenPrices[name]}
                
                sevenPIDs[name] = food_collection.insert_one(msg).inserted_id
            #
            sevenLock.release() # enhance thread safety
            #

            stocks.append({
                    '_id': sevenPIDs[name],
                    'quantity': quantity,
                    'updateDate': sevenDate
                })
    msg = {'updateDate':sevenDate, 'stocks':stocks}
    return msg
    

## Main: Update Seven
def _updateSeven(Longitude, Latitude):
    global sevenPIDs
    global sevenDate
    global sevenLock

    meta_seven = meta_collection.find_one({'brand': "7-11"})
    sevenPIDs = meta_seven['sevenPIDs']
    x = len(sevenPIDs)
    sevenDate = datetime.utcnow()+timedelta(hours = 8)
    sevenLock = Lock()

    # get and check token
    token = getToken()
    if token == None:
        logging.error("7-11 token expired, please update token.")
        return
    
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
        
    runThreading(storeIDs, func, os.cpu_count())

    # update sevenPIDs
    if len(sevenPIDs) > x:
        meta_collection.update_one({'brand': "7-11"},{'$set':{'sevenPIDs':sevenPIDs}})
        logging.info(f"Update {len(sevenPIDs)-x} sevenPIDs")

    logging.info("7-11 updated.")


# check available time
def isNowInTimePeriod(): 
    nowTime = (datetime.utcnow()+timedelta(hours = 8)).time()
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
    
    def get(self):
        return {
            'message': "Welcome to Thrifty third-party!"
        }
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
    logging.info("7-11 cleared.")


if __name__ == "__main__":
    # updateFamily()
    _updateSeven(121.532554, 25.017604)
    print('Test success!')