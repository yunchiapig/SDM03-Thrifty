import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    FormErrorMessage,
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
  import { useStoreAdmin } from '../hooks/useStoreAdmin';
  import jwt_decode from "jwt-decode";
  import instance from '../api';
  import { useTranslation } from 'react-i18next';

  
  export default function SignupCard() {
    const {loading, setLoading, setStoreInfo, setJwt} = useStoreAdmin();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [nameErr, setNameErr] = useState('');
    const [account, setAccount] = useState('');
    const [accountErr, setAccountErr] = useState('');
    const [password, setPassword] = useState('');
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [category, setCategory] = useState('其他');
    const [catErr, setCatErr] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneErr, setPhoneErr] = useState('');
    const [address, setAddress] = useState('');
    const [addrErr, setAddrErr] = useState('');
    const [latErr, setLatErr] = useState('');
    const [lonErr, setLonErr] = useState('');
    
    const FormCheck = () => {
       
        let pass = true
        // name
        if (name == ''){
            setNameErr('signup.inputBlank')
            pass = false
        }
        else if (/[^\u4E00-\u9FA5A-Za-z0-9]/.test(name)){
            setNameErr('signup.nameErr')
            pass = false
        }
        else {
            setNameErr('')
        }
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
        //phone
        if (phone == ''){
            setPhoneErr('signup.inputBlank')
            pass = false
        }
        else if (!(/^[0-9\-]+$/.test(phone))){
            setPhoneErr('signup.phoneErr')
            pass = false
        }
        else {
            setPhoneErr('')
        }
        //addr
        if (address === ''){
            setAddrErr('signup.inputBlank')
            pass = false
        }
        else if (!(/^(臺灣省|台灣省|台灣|臺灣)?\S+[市縣]\S+[區鄉鎮市]\S+[路街]\S+[段巷弄號](\S+樓)?$/).test(address)){
            setAddrErr('signup.addressErr')
            pass = false
        }
        else {
            setAddrErr('')
        }
        return pass
    }
    
    const HandleSubmit = async (event) => {
        setLoading(true);
        if (!FormCheck()) {
            setLoading(false);
            return
        }
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
            lon,
            lat
            ]
        }}
        await instance.post('api/1.0/admin/signup', data)
        .then(res => {
            localStorage.setItem('jwt', res.data.thriftyAdminJWT)
            setJwt(res.data.thriftyAdminJWT)
            const data = jwt_decode(res.data.thriftyAdminJWT).data
            localStorage.setItem('store_info', JSON.stringify({_id: data.storeID, email: data.email}));
            setStoreInfo({_id: data.storeID, email: data.email})
            localStorage.removeItem("login");
            navigate('/mainpage/ProductManagement');
        })
        .catch((e) => {
            setAccountErr('signup.error')
        })
        setLoading(false);
    }

      

  
    return (
        <Box w = {{'2xl': '70%', md: '80%', sm: '80%'}}>
            <Box
                rounded={'lg'}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'lg'}
                p={8}>
                <Stack mb = '5vh'>
                    <Heading fontSize={'4xl'} color = '#0C692E'>
                    {t('signup.signup')}
                    </Heading>
                    <Text fontSize={'lg'} color='gray'>
                    {t('signup.join')}
                    </Text>
                </Stack>
                <Stack spacing={4}>
                <FormControl id="name" isInvalid = {nameErr} isRequired>
                    <FormLabel>{t('signup.name')}</FormLabel>
                    <Input borderColor='whiteAlpha' value={name} onChange={e => {setName(e.target.value)}}/>
                    <FormErrorMessage>{t(nameErr)}</FormErrorMessage>
                </FormControl>
                <FormControl id="account" isInvalid = {accountErr} isRequired>
                    <FormLabel>{t('signup.account')}</FormLabel>
                    <Input borderColor='whiteAlpha' type="email" value={account} onChange={e => setAccount(e.target.value)}/>
                    <FormErrorMessage>{t(accountErr)}</FormErrorMessage>
                </FormControl>
                <FormControl id="password" isInvalid = {passwordErr} isRequired>
                    <FormLabel>{t('signup.password')}</FormLabel>
                    <InputGroup>
                    <Input  borderColor='whiteAlpha' type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}/>
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
                    <FormErrorMessage>{t(passwordErr)}</FormErrorMessage>
                </FormControl>
                {/*<FormControl isInvalid = {catErr} isRequired>
                    <FormLabel>{t('signup.category')}</FormLabel>
                    <Select borderColor='whiteAlpha'size = 'md' cursor = 'pointer' value={category} onChange={e => setCategory(e.target.value)}>
                        <option>其他</option>
                        <option>Seven</option>
                        <option>全家</option>
                    </Select>
                    <FormErrorMessage>{t(catErr)}</FormErrorMessage>
                    </FormControl>*/}
                <FormControl id="phone" isInvalid = {phoneErr} isRequired>
                    <FormLabel>{t('signup.phone')}</FormLabel>
                    <Input borderColor='whiteAlpha' type = 'tel' value={phone} onChange={e => setPhone(e.target.value)}/>
                    <FormErrorMessage>{t(phoneErr)}</FormErrorMessage>
                </FormControl>
                <FormControl id="address" isInvalid = {addrErr} isRequired>
                    <FormLabel>{t('signup.address')}</FormLabel>
                    <Input borderColor='whiteAlpha' type = 'text' value={address} onChange={e => setAddress(e.target.value)}/>
                    <FormErrorMessage>{t(addrErr)}</FormErrorMessage>
                </FormControl>
                {/*<FormControl id="lon" isInvalid = {lonErr} isRequired>
                    <FormLabel>{t('signup.lon')}</FormLabel>
                    <Input borderColor='whiteAlpha' type = 'text' value={lon} onChange={e => setLon(e.target.value)}/>
                    <FormErrorMessage>{t(lonErr)}</FormErrorMessage>
                </FormControl>
                <FormControl id="lat" isInvalid = {latErr} isRequired>
                    <FormLabel>{t('signup.lat')}</FormLabel>
                    <Input borderColor='whiteAlpha' type = 'text' value={lat} onChange={e => setLat(e.target.value)}/>
                    <FormErrorMessage>{t(latErr)}</FormErrorMessage>
                </FormControl>*/}
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
                    {t('signup.signup')}
                    </Button>
                </Stack>
                <Stack pt={6}>
                    <Text align={'center'}>
                    {t('signup.reminder')} <Link href = '/login' color={'blue.400'}>{t('signup.login')}</Link>
                    </Text>
                </Stack>
                </Stack>
            </Box>
    </Box>
    );
  }