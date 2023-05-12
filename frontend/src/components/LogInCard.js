import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import jwt_decode from "jwt-decode";
import instance from '../api';

export default function SimpleCard() {
  const navigate = useNavigate();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  const HandleSubmit = async (event) => {
        
    const data = 
    { 'email': account, 
    'password': password}
    await instance.post('api/1.0/admin/signin', data)
    .then(res => {
       /*console.log(jwt_decode(res.data.thriftyAdminJWT))*/
        localStorage.setItem('jwt', res.data.thriftyAdminJWT)
        localStorage.setItem('store_info', JSON.stringify(jwt_decode(res.data.thriftyAdminJWT).data));
        localStorage.removeItem("login");
        navigate('/mainpage/ProductManagement');
    })
  }
  return (
    
    <Box
      rounded={'lg'}
      w = '65%'
      bg={useColorModeValue('white', 'gray.700')}
      mt = '30vh'
      boxShadow={'lg'}
      p={8}>
      <Stack spacing={6}>
        <FormControl id="email">
          <FormLabel>Account</FormLabel>
          <Input type="email" value={account} onChange={e => setAccount(e.target.value)}/>
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
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
            Sign in
          </Button>
          <Button
            bg= '#72A8DB'
            color={'white'}
            _hover={{
              bg: '#85C4FF',
            }}>
            <Link to = '/signup'>
              New account
            </Link>
          </Button>
        </Stack>
      </Stack>
    </Box>
     
  );
}