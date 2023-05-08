food_category = {0: ['ricerolls', '御飯糰'], 
                 1: ['light', '光合蔬果沙拉'], 
                 2: ['cuisine', '台式料理'], 
                 3: ['Snacks', '風味小食'], 
                 4: ['ForeignDishes', '異國料理'], 
                 5: ['Noodles', '麵食'], 
                #  6: 'Oden',  # 關東煮
                #  7: 'Bigbite', # 大亨堡
                 10: ['bread', '麵包甜品'], 
                #  12: 'steam', 
                 13: ['luwei', '御料小館'], 
                #  14: 'health',  # 沒在用了好像 
                 15: ['sandwich', '原賞三明治'], 
                 16: ['ohlala', 'Ohlala'], 
                 17: ['veg', '天素地蔬'], 
                 18: ['star', '星級饗宴'] 
                #  19: 'panini'
                 }


from pymongo import MongoClient
import requests
import os
from dotenv import load_dotenv
from runThreading import runThreading
from queue import Queue
import xml.etree.ElementTree as ET

# Database Settings
load_dotenv()
CONNECTION_STRING = "mongodb+srv://{}:{}@thrifty.0xdedx2.mongodb.net/?retryWrites=true&w=majority"\
    .format(os.getenv('MONGODB_USER'), os.getenv('MONGODB_PASSWORD'))
db = MongoClient(CONNECTION_STRING).Thrifty
food_collection = db['food']
meta_collection = db['meta']
sevenPIDs = meta_collection.find_one({'brand':'7-11'})['sevenPIDs']
sevenPrices = set(meta_collection.find_one({'brand':'7-11'})['sevenPrices'])
n = len(sevenPIDs)
m = len(sevenPrices)

# API settings
food_api = "https://www.7-11.com.tw/freshfoods/read_food_xml.aspx"
headers = {
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
    }

# thread settings
my_queue = Queue()
for i, info in food_category.items():
    my_queue.put((i, info))


# main scrapping function
def func(i, info):
    cat_eng, cat_chinese = info
    r = requests.get(food_api, headers=headers, params={"":f"{i}"}).text

    if i == 12: 
        i-=1

    for child in ET.fromstring(r).findall('Item'):
        name = child.find('name').text.strip()
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
                    'description' : f"熱量{kcal}kcal。{content}",
                    'category': cat_chinese
                }
            
            if name in sevenPIDs:
                food_collection.update_one({'name':name, 'brand': "7-11"},{'$set':msg},upsert=True)
            else:
                msg['name'] = name
                msg['brand'] = '7-11'
                _id = food_collection.insert_one(msg).inserted_id
                sevenPIDs[name] = _id

            sevenPrices.add(name)
                


if __name__ == "__main__":
    runThreading(my_queue, func, 10)

    if len(sevenPIDs) > n:
        meta_collection.update_one({'brand':'7-11'}, {'$set': {'sevenPIDs': sevenPIDs}})
        print(f"{len(sevenPIDs)-n} new foods inserted.")

    if len(sevenPrices) > m:
        meta_collection.update_one({'brand':'7-11'}, {'$set': {'sevenPrices': list(sevenPrices)}})
        print(f"{len(sevenPrices)-m-len(sevenPIDs)+n} new foods updated.")

    print("Test Success!")