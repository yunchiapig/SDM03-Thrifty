import './App.css';
import { Box, VStack, useColorModeValue } from '@chakra-ui/react';
// import Card from "./Components/ShopInfoCard";
import NavBar from './Components/NavBar';
import React from "react";
import HomePage from './Containers/HomePage';
import SimpleSidebar from './Components/SideBar';
import StorePage from './Containers/StorePage';
import LoginPage from './Containers/LoginPage';
import SignupPage from './Containers/SignupPage';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUserInfo(user);
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    console.log(loggedInUser);
    if (loggedInUser) {
      setIsLoggedIn(true);
      setCurrentUserInfo(loggedInUser);
      // localStorage.clear();
    }
  }, [isLoggedIn]);

  return (
    <VStack >
      <Box w="100%" bg={useColorModeValue('gray.100', 'gray.900')}minH="100vh">
        <NavBar zIndex={100} isLoggedIn={isLoggedIn} currentUserInfo={currentUserInfo}/>
        {/* <SimpleSidebar/> */}
        <Box w="100%" h="19vh"/>
        
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/store/:id" element={ <StorePage/>} />
          <Route path="/login" element={ <LoginPage currentUserInfo={currentUserInfo} setCurrentUserInfo={handleLogin}/>} />
          <Route path="/signup" element={ <SignupPage/>} />
        </Routes>
        
        {/* <HomePage/> */}
        {/* <StorePage/> */}
      </Box>
      
      {/* <Card/>
      <ProductAddToCart/> */}
    </VStack>
  );
}

export default App;
