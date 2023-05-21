import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation} from "react-router-dom";
import './SubPage.css';
import Navbar from '../components/Navbar';
import ProductManagementPage from './ProductManagementPage';
import ProfilePage from './ProfilePage';
import SettingPage from './SettingPage';
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
} from '@chakra-ui/react';
import Spinner from '../components/Spinner'
import {
  FiServer,
  FiHome,
  FiSettings
} from 'react-icons/fi';
import {useStoreAdmin} from "../hooks/useStoreAdmin";
import { FiPlus } from "react-icons/fi";
import { useTranslation } from 'react-i18next';
//const storeInfo = JSON.parse(localStorage.getItem('store_info'));

export default () => {
  //for test
  //const [title, setTitle] = useState("");
  const {title, stocks, loading, drawerMount, setTitle, setDrawerMount, getItems, storeInfo, updateStoreInfo} = useStoreAdmin();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t } = useTranslation();

  
  useEffect(() => {
    if(localStorage.getItem('login') == null) {
      console.log('get')
      updateStoreInfo()
      localStorage.setItem('login', false)
    }
    if(location.pathname === "/mainpage/ProductManagement") {
      getItems()
      setTitle({ name: 'nav.productManagement', icon: FiServer, ref: "/ProductManagement"})
    }
    else if(location.pathname === "/mainpage/Profile") {
      setTitle({ name: 'nav.profile', icon: FiHome, ref: "/Profile" })
    }
    else if(location.pathname === "/mainpage/Settings") {
      setTitle({ name: 'nav.setting', icon: FiSettings, ref: "/Settings" })
    }
}, [location])

  return (  
      
    <Box w = 'full' h = {title.name !== 'nav.profile' ? '90vh' : 'auto'} mt = '80px' display = 'flex' px = '4%' py = '2%'>
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
                  {t(title.name)}
                </Text>
            </Flex>
            {title.name === "nav.productManagement" ? 
            <>
              <Button leftIcon={<FiPlus />} color='cadetblue' variant='solid' onClick={() => {setDrawerMount(true); onOpen()}}>
                {t("addItem")}
              </Button>
              {drawerMount? <EditFoodDrawer isOpen = {isOpen} onOpen = {onOpen} onClose = {() => {onClose(); setDrawerMount(false)}}/> : null}
            </> :
            null}
          </ Box>
          { title.name === "nav.productManagement" ? 
            <ProductManagementPage/> : 
            title.name === "nav.profile" ?
            <ProfilePage/> : 
            title.name === "nav.setting" ?
            <SettingPage/>: null}
        </Stack>
      </Card>
      </Box>
      
  );
}


