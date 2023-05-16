food_category = {0: 'ricerolls', 
                 1: 'light', 
                 2: 'cuisine', 
                 3: 'Snacks', 
                 4: 'ForeignDishes', 
                 5: 'Noodles', 
                #  6: 'Oden',  # 關東煮
                #  7: 'Bigbite', # 大亨堡
                 10: 'bread', 
                #  12: 'steam', 
                 13: 'luwei', 
                #  14: 'health',  # 沒在用了好像 
                 15: 'sandwich',
                 16: 'ohlala',
                 17: 'veg',
                 18: 'star'
                #  19: 'panini'
                 }


from pymongo import MongoClient
import requests
import os
from dotenv import load_dotenv
from runThreading import runThreading
from queue import Queue
import xml.etree.ElementTree as ET
from threading import Lock
import re


# Database Settings
load_dotenv()
CONNECTION_STRING = "mongodb+srv://{}:{}@thrifty.0xdedx2.mongodb.net/?retryWrites=true&w=majority"\
    .format(os.getenv('MONGODB_USER'), os.getenv('MONGODB_PASSWORD'))
db = MongoClient(CONNECTION_STRING).Thrifty
meta_collection = db['meta']
sevenPrices = meta_collection.find_one({'brand':'7-11'})['sevenPrices']
m = len(sevenPrices)

# API settings
food_api = "https://www.7-11.com.tw/freshfoods/read_food_xml.aspx"
headers = {
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
    }

# thread settings
my_queue = Queue()
for i, cat_eng in food_category.items():
    my_queue.put((i, cat_eng))

def regex(s):
    return re.sub('\(\w\)|\w\)\w\)| |★', '', s)

# main scrapping function
def func(i, cat_eng):
    r = requests.get(food_api, headers=headers, params={"":f"{i}"}).text

    if i == 12: 
        i-=1

    for child in ET.fromstring(r).findall('Item'):
        name = regex(child.find('name').text)
        if name not in sevenPrices:
            try:
                original_price = int(child.find('price').text.strip())
            except:
                continue
            kcal = child.find('kcal').text
            content = child.find('content').text
            kcal = kcal.strip() if kcal != None else ''
            content = content.strip() if content != None else ''
            msg = {
                    'img_url' : "https://www.7-11.com.tw/freshfoods/{}_{}/{}"\
                        .format(i+1, cat_eng, child.find('image').text.strip()),
                    'original_price' : original_price,
                    'discount_price' : round(original_price*0.65),
                    'description' : f"熱量{kcal}kcal。{content}"
                }
            lock.acquire()
            sevenPrices[name] = msg
            lock.release()



if __name__ == "__main__":
    lock = Lock()
    runThreading(my_queue, func, os.cpu_count())

    if len(sevenPrices) > m:
        meta_collection.update_one({'brand':'7-11'}, {'$set': {'sevenPrices': sevenPrices}})
        print(f"{len(sevenPrices)-m} new foods updated.")

    print("Test Success!")