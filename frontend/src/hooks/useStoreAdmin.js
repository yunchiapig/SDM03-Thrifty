import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../api.js';
import {useToast} from '@chakra-ui/react';
import jwt_decode from "jwt-decode";


const StoreAdminContext = createContext({
  title: ""
});



const StoreAdminProvider = (props) => {
  const [title, setTitle] = useState("");
  const [stocks, setStocks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerMount, setDrawerMount] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [login, setLogin] = useState(false);
  const [storeInfo, setStoreInfo] = useState(JSON.parse(localStorage.getItem('store_info')))
  const [jwt, setJwt] = useState(localStorage.getItem('jwt'))
  const toast = useToast(); 

  const checkTokenExpiration = () => {
    const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
    
    if(jwt_decode(jwt).exp < currentTime) {
      localStorage.removeItem("login");
      localStorage.removeItem("jwt");
      localStorage.removeItem("storeInfo");
      toast({
        title: `登入時間過久，請重新登入`,
        status: 'error',
        isClosable: true,
      })
      return true
    }
    return false
  }

  const getItems = async() => {
      //console.log(stocks)
      setLoading(true);
      const res
        = await instance.get('/api/1.0/admin/stock', { 
          params: {  
              id: storeInfo._id
      },})
      .then( res => {
        // from stock to items
        setLoading(false);
        let tempStocks = res?.data.data;
        if(tempStocks === undefined) {
          setStocks([]);
        }
      
        if(res?.status === 200) {
          // sort items by category
          let stockList = [];
          tempStocks.forEach(e => {
            let added = false
            stockList.forEach(s => {
              console.log(s)
              if(s.category === e.foodInfo.category) {
                s.items.push(e);
                added = true;
                return false;
              }
            })
            if(added === false) {
              stockList.push({category: e.foodInfo.category, items: [e]});
            }
            setStocks(stockList);
          });
      }
      })
      .catch( e => {
        console.log(e)
          //if(status === 400) {
              setStocks([]);
          //}
      }
      )
  }

  const updateStoreInfo = async() => {
    //console.log(storeInfo)
    checkTokenExpiration();
    const res
    = await instance.get('/api/1.0/admin/store', { 
      params: {  
        id: storeInfo._id
      },}).then( res => {
        let data = res.data.data
        console.log(data)
        let info = {
          "_id": data._id,
          "name": data.name,
          "category": data.category,
          "tel": data.tel,
          "address": data.address,
          "location": data.location,
          "updateDate": data.updateDate,
          "mainpage_img_url": data?.mainpage_img_url,
          "lat": data?.location.coordinates[1],
          "lon": data?.location.coordinates[0]
        }
        localStorage.setItem('store_info', JSON.stringify(info))
        setStoreInfo(info)
      })
  }
  

  return (
    <StoreAdminContext.Provider
      value={{
        loading,
        title,
        stocks,
        drawerMount,
        selectedType,
        login,
        storeInfo, 
        setStoreInfo,
        setTitle,
        setStocks,
        setDrawerMount,
        setJwt,
        getItems,
        setLoading,
        setSelectedType,
        setLogin,
        updateStoreInfo,
        checkTokenExpiration,
        jwt
      }}
      {...props}
    />
  );
};

function useStoreAdmin() {
  return useContext(StoreAdminContext);
}

export { StoreAdminProvider, useStoreAdmin };
