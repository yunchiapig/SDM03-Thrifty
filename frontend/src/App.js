import './App.css';
import { Box, VStack, useColorModeValue } from '@chakra-ui/react';
// import Card from "./Components/ShopInfoCard";
import NavBar from './Components/NavBar';
import React from "react";
import HomePage from './Containers/HomePage';
import SimpleSidebar from './Components/SideBar';
import StorePage from './Containers/StorePage';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <VStack >
      <Box w="100%" bg={useColorModeValue('gray.100', 'gray.900')}minH="100vh">
        <NavBar zIndex={100}/>
        {/* <SimpleSidebar/> */}
        <Box w="100%" h="19vh"/>
        
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/store/:id" element={ <StorePage/>} />
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
