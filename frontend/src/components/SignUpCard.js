import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    Select
  } from '@chakra-ui/react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import jwt_decode from "jwt-decode";
  import instance from '../api';
  
  export default function SignupCard() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [category, setCategory] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const HandleSubmit = async (event) => {
        
        const data = 
        { 'name': name, 
        'email': account, 
        'password': password, 
        'category': category,
        'tel': phone,
        'address': address,
        'location': {
            "type": "Point",
            "coordinates": [
            121.513,
            25.032
            ]
        }}
        await instance.post('api/1.0/admin/signup', data)
        .then(res => {
            localStorage.setItem('jwt', res.data.thriftyAdminJWT)
            localStorage.setItem('store_info', JSON.stringify(jwt_decode(res.data.thriftyAdminJWT).data));
            localStorage.removeItem("login");
            navigate('/mainpage/ProductManagement');
        })
    }
    
      

  
    return (
        <Box my = '10vh' w = '80%'>
            <Box
                rounded={'lg'}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'lg'}
                p={8}>
                <Stack mb = '5vh'>
                    <Heading fontSize={'4xl'} color = '#0C692E'>
                    Sign up
                    </Heading>
                    <Text fontSize={'lg'} color='gray'>
                    to join Thrifty
                    </Text>
                </Stack>
                <Stack spacing={4}>
                <FormControl id="name" isRequired>
                    <FormLabel>Store name</FormLabel>
                    <Input value={name} onChange={e => setName(e.target.value)}/>
                </FormControl>
                <FormControl id="account" isRequired>
                    <FormLabel>Account</FormLabel>
                    <Input type="email" value={account} onChange={e => setAccount(e.target.value)}/>
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                    <Input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}/>
                    <InputRightElement h={'full'}>
                        <Button
                        variant={'ghost'}
                        onClick={() =>
                            setShowPassword((showPassword) => !showPassword)
                        }>
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                    </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Store Type</FormLabel>
                    <Select placeholder='Select type' size = 'md' value={category} onChange={e => setCategory(e.target.value)}>
                        <option>其他</option>
                    </Select>
                </FormControl>
                <FormControl id="phone" isRequired>
                    <FormLabel>Phone number</FormLabel>
                    <Input type = 'tel' value={phone} onChange={e => setPhone(e.target.value)}/>
                </FormControl>
                <FormControl id="address" isRequired>
                    <FormLabel>Address</FormLabel>
                    <Input type = 'text' value={address} onChange={e => setAddress(e.target.value)}/>
                </FormControl>
                <Stack spacing={10} pt={2}>
                    <Button
                    loadingText="Submitting"
                    size="lg"
                    bg='#72A8DB'
                    color={'white'}
                    _hover={{
                        bg: '#85C4FF',
                    }}
                    onClick={HandleSubmit}
                    >
                    Sign up
                    </Button>
                </Stack>
                <Stack pt={6}>
                    <Text align={'center'}>
                    Already a in Thrifty? <Link href = '/login' color={'blue.400'}>Login</Link>
                    </Text>
                </Stack>
                </Stack>
            </Box>
    </Box>
    );
  }