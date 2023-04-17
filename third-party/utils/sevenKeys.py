from pymongo import MongoClient
import requests
import os
from dotenv import load_dotenv
from threading import Thread
from queue import Queue
from urllib import parse
import xml.etree.ElementTree as ET


cityCodes = {'台北市': '01',
             '基隆市': '02',
             '新北市': '03',
             '桃園市': '04',
             '新竹市': '05',
             '新竹縣': '06',
             '苗栗縣': '07',
             '台中市': '08',
             '彰化縣': '10',
             '南投縣': '11',
             '雲林縣': '12',
             '嘉義市': '13',
             '嘉義縣': '14',
             '台南市': '15',
             '高雄市': '17',
             '屏東縣': '19',
             '宜蘭縣': '20',
             '花蓮縣': '21',
             '台東縣': '22',
             '澎湖縣': '23',
             '連江縣': '24',
             '金門縣': '25',
             }


# Database Settings
load_dotenv()
CONNECTION_STRING = "mongodb+srv://{}:{}@thrifty.0xdedx2.mongodb.net/?retryWrites=true&w=majority"\
    .format(os.getenv('MONGODB_USER'), os.getenv('MONGODB_PASSWORD'))
db = MongoClient(CONNECTION_STRING).Thrifty
meta_collection = db['meta']
store_collection = db['store']


# API settings
towns_api = "https://emap.pcsc.com.tw/EMapSDK.aspx"
stores_api = "https://emap.pcsc.com.tw/EMapSDK.aspx"
headers = {
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
    }


def initializeSeven(store_infos):
    msgs = []

    # parse xml element
    for child in ET.fromstring(store_infos).findall("GeoPosition"):

        id = child.find('POIID').text.strip()
        X = child.find('X').text.strip().split('.')[0]
        Y = child.find('Y').text.strip().split('.')[0]
          
        store = {
            'original_id': id,
            'name': "7-11"+child.find('POIName').text.strip()+'門市',
            'category': '7-11',
            'tel': child.find('Telno').text.strip(),
            'address': child.find('Address').text.strip(),
            'location': {
                'type': 'Point', 
                'coordinates':[float(X[:3]+'.'+X[3:]), float(Y[:2]+'.'+Y[2:])]
                }
        }
        sevenKeys.append(id)
        msgs.append(store)
    
    if msgs:
      store_collection.insert_many(msgs)


if __name__ == "__main__":

    # check sevenKeys
    global sevenKeys
    sevenKeys = meta_collection.find_one({'brand':'7-11'})['sevenKeys']
    if sevenKeys != []:
        print('7-11 has already been filed.')
        exit()

    # fill queue
    my_queue = Queue()
    for city, code in cityCodes.items():
        towns = requests.post(towns_api, headers=headers, data=f"commandid=GetTown&cityid={code}&leftMenuChecked=").text
        # parse xml element
        for child in ET.fromstring(towns).findall('GeoPosition'):
            town = child.find('TownName').text.strip()
            my_queue.put((city, town))

    # setup workers
    class Worker(Thread):
        def __init__(self, queue):
            Thread.__init__(self)
            self.queue = queue

        def run(self):
            while self.queue.qsize() > 0:
                city, town = self.queue.get()
                _city = parse.quote(city) # url encoding
                _town = parse.quote(town) # url encoding
                data = f"commandid=SearchStore&city={_city}&town={_town}&roadname=&ID=&StoreName=&SpecialStore_Kind=&leftMenuChecked=&address="
                store_infos = requests.post(stores_api, headers=headers, data=data).text
                initializeSeven(store_infos)

    # workers start working
    workers = [Worker(my_queue) for _ in range(4)]
    for worker in workers:
        worker.start()
    for worker in workers:
        worker.join()

    # update
    meta_collection.update_one({'brand':'7-11'},
                               {'$set': {'sevenKeys': list(sevenKeys)}})

    # Finished!
    print('7-11 filing Success!')
    