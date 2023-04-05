import './App.css';
import { Box, VStack, useColorModeValue, Flex } from '@chakra-ui/react';
// import Card from "./Components/ShopInfoCard";
import NavBar from './Components/NavBar';
import React from "react";
import HomePage from './Containers/HomePage';
import SimpleSidebar from './Components/SideBar';
import StorePage from './Containers/StorePage';

function App() {

  return (
    <VStack >
      <Box w="100%" bg={useColorModeValue('gray.100', 'gray.900')}minH="100vh">
        <NavBar zIndex={100}/>
        {/* <SimpleSidebar/> */}
        <Box w="100%" h="19vh"/>
        
        <HomePage/>
        <StorePage/>
      </Box>
      
      {/* <Card/>
      <ProductAddToCart/> */}
    </VStack>
  );
}

export default App;
