import { createContext, useContext, useState } from 'react';
import instance from '../api.js';


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

  const getItems = async() => {
      const storeInfo = JSON.parse(localStorage.getItem('store_info'))
      console.log(storeInfo)
      setLoading(true);
      const res
        = await instance.get('/api/1.0/foods', { 
          params: {  
              id: storeInfo.storeID
      },}).catch( e => {
         console.log(e)
          //if(status === 400) {
              setStocks([]);
          //}
      }
      )
      // from stock to items
      setLoading(false);
      let tempStocks = res?.data.message;
      if(res?.status === 200) {
        // sort items by tags
        let stockList = [];
        tempStocks.forEach(e => {
          let added = false
          stockList.forEach(s => {
            if(s.tag === e.food.tag) {
              s.items.push(e);
              added = true;
              return false;
            }
          })
          if(added === false) {
            stockList.push({tag: e.food.tag, items: [e]});
          }
          setStocks(stockList);
        });
        
      }
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
        setTitle,
        setStocks,
        setDrawerMount,
        getItems,
        setLoading,
        setSelectedType,
        setLogin
      }}
      {...props}
    />
  );
};

function useStoreAdmin() {
  return useContext(StoreAdminContext);
}

export { StoreAdminProvider, useStoreAdmin };
