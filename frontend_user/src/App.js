import './App.css';
import { Box, VStack, useColorModeValue } from '@chakra-ui/react';
import NavBar from './Components/NavBar';
import React, {useEffect, useState} from "react";
import HomePage from './Containers/HomePage';
import SimpleSidebar from './Components/SideBar';
import StorePage from './Containers/StorePage';
import LoginPage from './Containers/LoginPage';
import SignupPage from './Containers/SignupPage';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { use } from 'i18next';
import MyFavPage from './Containers/MyFavPage';


function App() {
  const [filterOptions, setFilterOptions] = useState({'store':[], 'item':[]});
  const [filteredValues, setFilteredValues] = useState({'store':[], 'item':[]});
  const [storesData, setStoresData] = useState([]);
  const [myFavData, setMyFavData] = useState([]);
  const DEFAULT_LOCATION = { lat: 25.03, lng: 121.55};
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [mapCenter, setMapCenter] = useState(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const { i18n } = useTranslation();
  const [onHomePage, setOnHomePage] = useState(false);
  const time_interval = 2500;

  // useEffect(()=>{
  //   setLanguageValue(i18n.language);
  // }, [i18n.language])

  useEffect(()=>{
    console.log('storesData', storesData)
  }, [storesData])

  useEffect(()=>{
    // console.log('options', filterOptions.item)
    // console.log('values', filteredValues.item)
    let values = filteredValues
    let storeFV = values.store.filter((v) => { 
      for (const opt of filterOptions.store){
        if (opt === v) {return true}
      }
      return false;
    });
    let itemFV = values.item.filter((v) => { 
      for (const opt of filterOptions.item){
        if (opt === v) {return true}
      }
      return false;
    });
    // console.log('item selected', itemFV)
    setFilteredValues({'store': storeFV, 'item': itemFV});
  }, [filterOptions])

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
    let timeout;
    timeout = setTimeout(async () => {
      if (mapCenter){
        // trigger 711 cron job
        axios.post(`https://thrifty-tw.shop/third-party`, {Longitude: mapCenter.lng, Latitude: mapCenter.lat}, { crossdomain: true })
          .then(response => {
            // console.log(response.data);
        });
        axios.get(`https://thrifty-tw.shop/api/1.0/user/stores?longitude=${mapCenter.lng}&latitude=${mapCenter.lat}`,  { crossdomain: true })
          .then(response => {
            var stores = response.data.message
            setStoresData(stores);
            
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
        // console.log('storesData', storesData);
      }
    }, time_interval);

    return () => clearTimeout(timeout);
    
  }, [mapCenter]);

  useEffect(() => {
    if (localStorage.getItem('_id') !== null) {
      axios.get(`https://thrifty-tw.shop/api/1.0/user/fav?userID=${localStorage.getItem('_id')}`,  { crossdomain: true })
        .then(response => {
          var favs = response.data.message
          setMyFavData(favs);
      });
    }
  }, []);


  // const handleLogin = (user) => {
  //   setCurrentUserInfo(user);
  // }

  // useEffect(() => {
  //   if (localStorage.getItem("name") !== null) {
  //     const loggedInUser = localStorage.getItem("name");
  //     console.log(loggedInUser);
  //     if (loggedInUser) {
  //       setCurrentUserInfo(loggedInUser);
  //       // localStorage.clear();
  //     }
  //   }
  // }, [isLoggedIn]);

  return (
    <VStack >
      <Box w="100%" bg={useColorModeValue('gray.100', 'gray.900')} minH="100vh">
        <NavBar zIndex={100} filterOptions={filterOptions} onHomePage={onHomePage}
          filteredValues={filteredValues} setFilteredValues={setFilteredValues} />
        {/* <SimpleSidebar/> */}
        <Box w="100%" h={'12vw'}/>
        
        <Routes>
          <Route path="/" element={<HomePage filteredValues={filteredValues} setOnHomePage={setOnHomePage}
              userLocation={userLocation} mapCenter={mapCenter} setMapCenter={setMapCenter}
              storesData={storesData}/>}/>
          <Route path="/store/:id" element={ <StorePage setOnHomePage={setOnHomePage} />} />
          <Route path="/login" element={ <LoginPage setOnHomePage={setOnHomePage}/>} />
          <Route path="/signup" element={ <SignupPage setOnHomePage={setOnHomePage}/>} />
          <Route path="/myfav" element={ <MyFavPage filteredValues={filteredValues} setOnHomePage={setOnHomePage} 
              storesData={ myFavData }/> } />
        </Routes>
      </Box>
    </VStack>
  );
}

export default App;
