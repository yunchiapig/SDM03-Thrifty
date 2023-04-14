import { createContext, useContext, useState } from 'react';
import instance from '../api.js';
const StoreAdminContext = createContext({
  title: ""
});



const StoreAdminProvider = (props) => {
    const [title, setTitle] = useState("");
    const [stocks, setStocks] = useState(null);
    const [store, setStore] = useState("6433a8510c114b2bafa70664");
    const [loading, setLoading] = useState(false);
    const [drawerMount, setDrawerMount] = useState(false);
    const [selectedType, setSelectedType] = useState("");

    const getItems = async() => {
        setLoading(true);
        const res
         = await instance.get('/api/1.0/foods', { 
            params: {  
                id: store
        },}).catch( e => {
            //if(status === 400) {
                setStocks([]);
            //}
        }
        )
        // console.log(res);
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
          
          //console.log(stockList);
        }
        /*else if (status === 400) {
            setStocks([]);
        }*/
    }

  return (
    <StoreAdminContext.Provider
      value={{
        loading,
        title,
        stocks,
        store,
        drawerMount,
        selectedType,
        setTitle,
        setStocks,
        setStore,
        setDrawerMount,
        getItems,
        setLoading,
        setSelectedType
      }}
      {...props}
    />
  );
};

function useStoreAdmin() {
  return useContext(StoreAdminContext);
}

export { StoreAdminProvider, useStoreAdmin };
