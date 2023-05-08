import './App.css';
import { Box, VStack, useColorModeValue } from '@chakra-ui/react';
import NavBar from './Components/NavBar';
import React, {useEffect, useState} from "react";
import HomePage from './Containers/HomePage';
import SimpleSidebar from './Components/SideBar';
import StorePage from './Containers/StorePage';
import LoginPage from './Containers/LoginPage';
import SignupPage from './Containers/SignupPage';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from "axios";


function App() {
  const [filterOptions, setFilterOptions] = useState({'store':[], 'item':[]});
  const [filteredValues, setFilteredValues] = useState({'store':[], 'item':[]});
  const [storesData, setStoresData] = useState([]);
  const [storesDataforList, setStoresDataforList] = useState([]);
  const DEFAULT_LOCATION = { lat: 25.03, lng: 121.55};
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(()=>{
    console.log('userLocation', userLocation)
  }, [userLocation])

  useEffect(() => { 
    console.log("RELOAD APP.") 
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setMapCenter({ lat: latitude, lng: longitude });
      },
      () => {
        console.log('User location not available.');
        setMapCenter(DEFAULT_LOCATION);
      }
    );
  }, []);

  useEffect(() => {
    if (mapCenter){
      axios.get(`http://52.193.252.15/api/1.0/stores?longitude=${mapCenter.lng}&latitude=${mapCenter.lat}`,  { crossdomain: true })
        .then(response => {
          var stores = response.data.message
          setStoresData(stores);
          const data = stores.reduce(function (rows, key, index) { 
              return (index % 2 === 0 ? rows.push([key]) 
              : rows[rows.length-1].push(key)) && rows;
          }, []);
          setStoresDataforList(data);
          
          var storeCategories = stores.map(store => store.category);
          storeCategories = storeCategories.filter(
              (s, idx) => storeCategories.indexOf(s) === idx
          )
          var itemCategories = Array();
          stores.forEach((store) => {
              var cat = store.stocks.map(stock => stock.category)
              itemCategories = [...itemCategories, ...cat];
          });
          itemCategories = itemCategories.filter(
              (i, idx) => itemCategories.indexOf(i) === idx
          )
          setFilterOptions({'store':storeCategories, 'item':itemCategories});
      });
    }
  }, [mapCenter]);

  return (
    <VStack >
      <Box w="100%" bg={useColorModeValue('gray.100', 'gray.900')}minH="100vh">
        <NavBar zIndex={100} filterOptions={filterOptions} 
          filteredValues={filteredValues} setFilteredValues={setFilteredValues}/>
        {/* <SimpleSidebar/> */}
        <Box w="100%" h="19vh"/>
        
        <Routes>
          <Route path="/" element={<HomePage filteredValues={filteredValues}
              userLocation={userLocation} mapCenter={mapCenter} setMapCenter={setMapCenter}
              storesData={storesData} storesDataforList={storesDataforList}/>}/>
          <Route path="/store/:id" element={ <StorePage/>} />
          <Route path="/login" element={ <LoginPage/>} />
          <Route path="/signup" element={ <SignupPage/>} />
        </Routes>
      </Box>
    </VStack>
  );
}

export default App;
