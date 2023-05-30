import React, { ReactNode, useEffect, useState } from 'react';
import { useStoreAdmin } from '../hooks/useStoreAdmin';
import Cropper from 'react-easy-crop';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Stack,
    IconButton, 
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    Select,
    useToast,
    Image
  } from '@chakra-ui/react';
import CropperModal from '../components/CropperModal'
import instance from '../api';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation();
    const {setLoading, updateStoreInfo, storeInfo, jwt} = useStoreAdmin();
    const [name, setName] = useState(storeInfo.name || '');
    const [nameErr, setNameErr] = useState('');
    const [category, setCategory] = useState(storeInfo.category ||'');
    const [catErr, setCatErr] = useState('');
    const [phone, setPhone] = useState(storeInfo.tel ||'');
    const [phoneErr, setPhoneErr] = useState('');
    const [address, setAddress] = useState(storeInfo.address ||'');
    const [addrErr, setAddrErr] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [lat, setLat] = useState(storeInfo.lat || '');
    const [lon, setLon] = useState(storeInfo.lon || '');
    const [latErr, setLatErr] = useState('');
    const [lonErr, setLonErr] = useState('');
    const toast = useToast()
    
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
        //category
        if (category == ''){
            setCatErr('signup.fieldBlank')
            pass = false
        }
        else {
            setCatErr('')
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
        //lat
        if (lat === ''){
            setLatErr('signup.inputBlank')
            pass = false
        }
        else if (!(/^(-?(?:1[0-7]|[1-9])?\d(?:\.\d+)?|180(?:\.0+)?)$/).test(lat)){
            setLatErr('signup.latErr')
            pass = false
        }
        else {
            setLatErr('')
        }
        //lat
        if (lon === ''){
            setLonErr('signup.inputBlank')
            pass = false
        }
        else if (!(/^(-?(?:1[0-7]|[1-9])?\d(?:\.\d+)?|180(?:\.0+)?)$/).test(lon)){
            setLonErr('signup.lonErr')
            pass = false
        }
        else {
            setLonErr('')
        }
        return pass
    }
    const HandleSave = async() => {
        if(!FormCheck()) {
            return
        }
        setLoading(true);
        let formData = new FormData();
        
        if (imageFile !== null) {
            formData.append('mainpage_img_url', imageFile);
        }
        formData.append('storeID', storeInfo._id);
        let updateInfo = {
            name,
            category,
            tel: phone,
            address: address,
            location: {
                type: "Point",
                coordinates: [
                  lon,
                  lat
                ]
              }
        }
        formData.append('updateInfo', JSON.stringify(updateInfo));
    
        await instance.put('api/1.0/admin/store', formData, {
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'multipart/form-data'
            }, }, { crossdomain: true })
        .then(async(res) => {
            await updateStoreInfo()
            toast({
                title: t('profile.success'),
                status: 'success',
                isClosable: true,
            })
        })
        .catch(e => {
            toast({
                title: t('profile.fail'),
                status: 'error',
                isClosable: true,
            })
        })
        
        setLoading(false);
        
    }

    return (
        <Box h='100%' w = '100%' p = '10' overflow='scroll'>
        <Stack spacing={6} w = {{base: '340px', md:'635px'}}>  
        <CropperModal storeImage = {storeInfo.mainpage_img_url} setImageFile = {setImageFile}/>
        {/*imageFile && <Image src= {URL.createObjectURL(imageFile)} alt='Preview' />*/}
        <FormControl id="name" isInvalid={nameErr} isRequired>
            <FormLabel>{t('signup.name')}</FormLabel>
            <Input value={name} borderColor='whiteAlpha' onChange={e => setName(e.target.value)}/>
            <FormErrorMessage>{t(nameErr)}</FormErrorMessage>
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
            <Input type = 'tel' borderColor='whiteAlpha' value={phone} onChange={e => setPhone(e.target.value)}/>
            <FormErrorMessage>{t(phoneErr)}</FormErrorMessage>
        </FormControl>
        <FormControl id="address" isInvalid = {addrErr} isRequired>
            <FormLabel>{t('signup.address')}</FormLabel>
            <Input type = 'text' borderColor='whiteAlpha' value={address} onChange={e => setAddress(e.target.value)}/>
            <FormErrorMessage>{t(addrErr)}</FormErrorMessage>
        </FormControl>
        {/*<FormControl id="lon" isInvalid = {lonErr} isRequired>
            <FormLabel>{t('signup.lon')}</FormLabel>
            <Input borderColor='whiteAlpha' type = 'text' value={lon} onChange={e => setLon(e.target.value)}/>
            <FormErrorMessage>{t(lonErr)}</FormErrorMessage>
        </FormControl>
        <FormControl id="address" isInvalid = {latErr} isRequired>
            <FormLabel>{t('signup.lat')}</FormLabel>
            <Input borderColor='whiteAlpha' type = 'text' value={lat} onChange={e => setLat(e.target.value)}/>
            <FormErrorMessage>{t(latErr)}</FormErrorMessage>
    </FormControl>*/}
        <Box display='flex' flexDirection='row-reverse'>
            <Button colorScheme='teal' size='md' w = '80px' onClick={() => HandleSave()}>
                {t("profile.save")}
            </Button>
        </Box>
        </Stack>
    </Box>
    )
}