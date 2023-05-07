import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation} from "react-router-dom";
import './SubPage.css';
import Navbar from '../components/Navbar';
import ProductManagementPage from './ProductManagementPage';
import instance from '../api.js';
import EditFoodDrawer from '../components/EditFoodDrawer';
import {
  Box,
  Button,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  useDisclosure,
  Card,
  Stack,
  StackDivider,
  Spinner
} from '@chakra-ui/react';
import {useStoreAdmin} from "../hooks/useStoreAdmin";
import { FiPlus } from "react-icons/fi";


export default () => {
  //for test
  //const [title, setTitle] = useState("");
  const {title, stocks, store, loading, drawerMount, setStocks, setDrawerMount, getItems} = useStoreAdmin();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  useEffect(() => {
    if(location.pathname === "mainpage/ProductManagement") {
      getItems(store)
  }}, [location])

  return (  
      
    <Box w = 'full' h = '90vh' mt = '80px' display = 'flex' px = '4%' py = '2%'>
      <Card  display = 'flex' w = '100%' h = '100%'>
        <Stack divider={<StackDivider />} h = '100%' w = '100%'>
          <Box h = '8%' display="flex" alignItems="center" pt = {2}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                w='80%'
              >
                {title.icon && (
                <Icon
                    mr="4"
                    fontSize="22"
                    as={title.icon}
                />
                )}
                <Text fontSize={22}>
                  {title.name}
                </Text>
            </Flex>
            {title.name === "商品管理" ? 
            <>
              <Button leftIcon={<FiPlus />} color='cadetblue' variant='solid' onClick={() => {setDrawerMount(true); onOpen()}}>
                新增類別
              </Button>
              {drawerMount? <EditFoodDrawer isOpen = {isOpen} onOpen = {onOpen} onClose = {() => {onClose(); setDrawerMount(false)}}/> : null}
            </> :
            null}
          </ Box>
          { title.name === "商品管理" ? 
            <ProductManagementPage/> : 
            null}
        </Stack>
      </Card>
      {loading ? <Spinner
      thickness='4px'
      speed='0.65s'
      emptyColor='gray.200'
      color='blue.500'
      size='xl'
      top='50%'
      left='55%'
      position = 'absolute'
      zIndex={1}
    />: null}
      </Box>
      
  );
}


