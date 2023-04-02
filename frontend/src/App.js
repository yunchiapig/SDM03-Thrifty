import './App.css';
import { Box, VStack, useColorModeValue, Flex, Container } from '@chakra-ui/react';
// import Card from "./Components/ShopInfoCard";
import NavBar from './Components/NavBar';
import Toggle from 'react-styled-toggle';
import React, { useState } from "react";
import SimpleSidebar from './Components/SideBar';
import ShopInfoCard from './Components/ShopInfoCard';

function App() {
  const [ifMapMode, setIfMapMode] = useState(true);

  return (
    <VStack >
      <Box w="100%" bg={useColorModeValue('gray.100', 'gray.900')}>
        <NavBar zindex={1}/>

        <Box>
          <Box w="100%" h="20vh"/>
          <Box p={5} >
            <Flex>
              <Toggle labelLeft='Map' labelRight='List' style={{zIndex:10}}
                backgroundColorUnchecked='#82BFF3'backgroundColorChecked='#76CFCF'
                onChange={()=>{setIfMapMode(!ifMapMode)}}
              />
            </Flex>
          </Box>

          <Box minH="80vh" ml={5} bg={useColorModeValue('gray.100', 'gray.900')}>
            <Flex>
              {/* <SimpleSidebar/> */}
              {ifMapMode?
                <></>:
                <Box>
                  <Flex>
                    <ShopInfoCard/>
                    <ShopInfoCard/>
                  </Flex>
                  <Flex>
                    <ShopInfoCard/>
                    <ShopInfoCard/>
                  </Flex>
                  <Flex>
                    <ShopInfoCard/>
                    <ShopInfoCard/>
                  </Flex>
                </Box>
              }
            </Flex>
            
          </Box>
        </Box>
      </Box>
      
      {/* <Card/>
      <ProductAddToCart/> */}
    </VStack>
  );
}

export default App;
