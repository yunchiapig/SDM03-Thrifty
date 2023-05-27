import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Spinner from './Spinner';
import jwt_decode from "jwt-decode";
import instance from '../api';
import { useStoreAdmin } from '../hooks/useStoreAdmin';
import { useTranslation } from 'react-i18next';

export default function SimpleCard() {
  const { t } = useTranslation();
  const {loading, setLoading, setStoreInfo, setJwt} = useStoreAdmin();
  const navigate = useNavigate();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [accountErr, setAccountErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const FormCheck = () => {
    let pass = true
    //email
    if (account == ''){
        setAccountErr('signup.inputBlank')
        pass = false
    }
    else if (!/^[^\s@~`!#$%^&*()\-+={}[\]]+@[^\s@]+\.[^\s@]+$/.test(account)){
       setAccountErr('signup.emailErr')
       pass = false
    }
    else {
        setAccountErr('')
    }
    //password
    if (password == ''){
        setPasswordErr('signup.inputBlank')
        pass = false
    }
    else {
        setPasswordErr('')
    }
    
    return pass
  }
  const HandleSubmit = async (event) => {
    if(!FormCheck()) {
      return
    }
    setLoading(true);
    const data = 
    { 'email': account, 
    'password': password}
    await instance.post('api/1.0/admin/signin', data)
    .then((res) => {
        localStorage.setItem('jwt', res.data.thriftyAdminJWT)
        setJwt(res.data.thriftyAdminJWT)
        const data = jwt_decode(res.data.thriftyAdminJWT).data
        localStorage.setItem('store_info', JSON.stringify({_id: data.storeID, email: data.email}));
        setStoreInfo({_id: data.storeID, email: data.email})
        localStorage.removeItem("login");
        navigate('/mainpage/ProductManagement');
    })
    .catch((e) => {
      setAccountErr('login.error')
      setPasswordErr('login.error')
    })
    setLoading(false);
  }
  return (
    <Box
      rounded={'lg'}
      w = {{'2xl': '70%', md: '80%', sm: '80%'}}
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow={'lg'}
      p={8}>
      <Stack spacing={6}>
        <FormControl id="email" isInvalid={accountErr}>
          <FormLabel>{t('login.account')}</FormLabel>
          <Input type="email" borderColor='whiteAlpha' value={account} onChange={e => setAccount(e.target.value)}/>
          <FormErrorMessage>{t(accountErr)}</FormErrorMessage>
        </FormControl>
        <FormControl id="password" isInvalid={accountErr}>
          <FormLabel>{t('login.password')}</FormLabel>
          <Input type="password" borderColor='whiteAlpha' value={password} onChange={e => setPassword(e.target.value)}/>
          <FormErrorMessage>{t(passwordErr)}</FormErrorMessage>
        </FormControl>
        <Stack spacing={4}>
          {/*<Stack
            direction={{ base: 'column', sm: 'row' }}
            align={'start'}
            justify={'space-between'}>
            <Checkbox>Remember me</Checkbox>
            <Link color='#4FA060'>Forgot password?</Link>
  </Stack>*/}
          <Button
            bg= '#4FA060'
            color={'white'}
            _hover={{
              bg: '#61C777',
            }}
            onClick={HandleSubmit}
            >
            {t('login.login')}
          </Button>
          <Button
            bg= '#72A8DB'
            color={'white'}
            _hover={{
              bg: '#85C4FF',
            }}>
            <Link to = '/signup'>
            {t('login.new')}
            </Link>
          </Button>
        </Stack>
      </Stack>
    </Box>
     
  );
}