import React, { ReactNode, useEffect, useState } from 'react';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Box,
    Stack,
    Button,
    Input,
    Text,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useToast,
    Img
    //Select
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons'
//import { Select } from 'antd';
import CustomSelect from './CustomSelect';
import instance from '../api';
import styled from 'styled-components';
import {useStoreAdmin} from "../hooks/useStoreAdmin";
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import ItemCropperModal from './ItemCropperModal';





export default ({ isOpen, onOpen, onClose, item, certain, addToTag}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToast(); 
    const {store, stocks, setStocks, loading, setLoading, setDrawerMount, getItems, storeInfo, jwt, checkTokenExpiration} = useStoreAdmin();
    const firstField = React.useRef();
    const secondField = React.useRef();
    const QtyRef = React.useRef();
    const [name, setName] = useState(item?.foodInfo.name || "");
    const [nameErr, setNameErr] =useState(false)
    const [category, setCategory] = useState(item?.foodInfo.category || addToTag || "");
    const [catErr, setCatErr] =useState(false)
    const [quantity, setQuantity] = useState(item?.quantity || "0");
    const [qtyErr, setQtyErr] =useState(false)
    const [discountedPrice, setDiscountedPrice] = useState(item?.foodInfo.discount_price || "");
    const [dPriceErr, setDPriceErr] =useState(false)
    const [price, setPrice] = useState(item?.foodInfo.original_price || "");
    const [priceErr, setPriceErr] =useState(false)
    const [description, setDescription] = useState(item?.foodInfo.description || "");
    const [desErr, setDesErr] =useState(false)
    const [initialImg, setInitialImg] = useState(item?.foodInfo ? item.foodInfo.img_url: undefined)
    const [image, setImage] = useState(null);
    const [imgErr, setImgErr] =useState(false)
    

    const FormCheck = () => {
        let pass = true
        //name
        if (name == ''){
            setNameErr('signup.inputBlank')
            pass = false
        }
        else {
            setNameErr('')
        }
        //tag
        if (category == ''){
            setCatErr('signup.inputBlank')
            pass = false
        }
        else {
            setCatErr('')
        }
        //des
        if (description == ''){
            setDesErr('signup.inputBlank')
            pass = false
        }
        else {
            setDesErr('')
        }
        //qty
        if (quantity == ''){
            setQtyErr('signup.inputBlank')
            pass = false
        }
        else {
            setQtyErr('')
        }
        let priceCorrect = true
         //price
        if (price == ''){
            setPriceErr('signup.inputBlank')
            priceCorrect = false
            pass = false
        }
        else if (!(/^\d+$/.test(price))){
            setPriceErr("fooddrawer.priceErr")
            pass = false
            priceCorrect = false
        }
        else {
            setPriceErr('')
        }
         //dprice
         if (discountedPrice == ''){
            setDPriceErr('signup.inputBlank')
            pass = false
            priceCorrect = false
        }
        else if (!(/^\d+$/.test(discountedPrice))){
            setDPriceErr("fooddrawer.priceErr")
            priceCorrect = false
            pass = false
        }
        else {
            setDPriceErr('')
        }

        if(priceCorrect) {
            if(Number(price) <= Number(discountedPrice)) {
                setDPriceErr("fooddrawer.priceErr2")
                setPriceErr("fooddrawer.priceErr2")
                pass = false
            }
        }
        //image
        if (!item && image === null) {
            setImgErr('signup.inputBlank')
            pass = false
        }
        else {
            setImgErr('')
        }
        
        return pass
      }

    const HandleSubmit = async() => {
        setLoading(true);
        if (!FormCheck()) {
            setLoading(false)
            return
        }
        let formData = new FormData();
        formData.append('img_url', image);
        formData.append('storeID', storeInfo._id);
        let updateInfo = {
            name,
            category,
            original_price: price,
            discount_price: discountedPrice,
            description
        }
        formData.append('updateInfo', JSON.stringify(updateInfo));
    
        instance.post('api/1.0/admin/food', formData, {
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'multipart/form-data'
            },
        })
        .then(async(res) => {
            let stock = {
                storeID: storeInfo._id,
                foodID: res.data.data._id,
                updateQty: quantity
            }
            await instance.put('api/1.0/admin/stock', stock, 
            { headers: {
                'Authorization': `Bearer ${jwt}`,
            }}
            )
            await getItems()
            toast({
                title: t('toast.addItem', {name}),
                status: 'success',
                isClosable: true,
            })
            onClose();
        })
        .catch(e => {
            
            if(e.response.data.message === '食物品項已存在。') {
                setNameErr("fooddrawer.existErr")
            }
            toast({
                title: t('toast.addfail'),
                status: 'error',
                isClosable: true,
            })
        });
        setLoading(false);
        
    }

    const HandleUpdate = async() => {
        setLoading(true);
        if (!FormCheck()) {
            setLoading(false);
            return
        }
        let formData = new FormData();
        if (image !== null) {
            formData.append('img_url', image);
        }
        formData.append('foodID', item._id);
        let updateInfo = {
            name,
            category,
            original_price: price,
            discount_price: discountedPrice,
            description
        }
        formData.append('updateInfo', JSON.stringify(updateInfo));
    
        instance.put('api/1.0/admin/food', formData, {
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'multipart/form-data'
            },
        })
        .then(async(res) => {
            let stock = {
                storeID: storeInfo._id,
                foodID: res.data.data._id,
                updateQty: quantity
            }
            await instance.put('api/1.0/admin/stock', stock, 
            { headers: {
                'Authorization': `Bearer ${jwt}`,
            }}
            )
            await getItems()
            toast({
                title: t('toast.editItem', {name}),
                status: 'success',
                isClosable: true,
            })
            onClose();
        })
        .catch(e => {
            if(e.response.data.message === '食物品項已存在。') {
                setNameErr("fooddrawer.existErr")
            }
            toast({
                title: t('toast.modifyfail'),
                status: 'error',
                isClosable: true,
            })
        });
        setLoading(false);
        
    }
    return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            initialFocusRef= {certain === "qty" ? QtyRef : item == undefined ? firstField : secondField}
            onClose={() => {
                onClose();
                setDrawerMount(false);
            }}
        >
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>
                {item === undefined ? t('addItem'): t('fooddrawer.edititem')}
            </DrawerHeader>

            <DrawerBody>
                <Stack spacing='24px'>
                <Box>
                    <FormControl isInvalid = {nameErr} isRequired>
                        <FormLabel htmlFor='username'>{t('fooddrawer.name')}</FormLabel>
                        <Input
                        ref={firstField}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        isReadOnly = {item === undefined ? false: true} 
                        />
                        <FormErrorMessage>{t(nameErr)}</FormErrorMessage>
                    </FormControl>
                </Box>

                <Box>
                    <FormControl isInvalid = {catErr} isRequired>
                        <FormLabel htmlFor='owner'>{t('fooddrawer.tag')}</FormLabel>
                        <Text color = '#787878'>{t('fooddrawer.tagdes')}</Text>
                        <CustomSelect tag = {category} setTag={setCategory}/>
                        <FormErrorMessage>{t(catErr)}</FormErrorMessage>
                    </FormControl>
                </Box>

                <Box>
                    <FormControl isInvalid = {desErr} isRequired>
                        <FormLabel htmlFor='desc'>{t('fooddrawer.description')}</FormLabel>
                        <Textarea  id='desc' value={description} ref={secondField}
                        onChange={e => setDescription(e.target.value)}/>
                        <FormErrorMessage>{t(desErr)}</FormErrorMessage>
                    </FormControl>
                </Box>
                <Box>
                    <FormControl isInvalid = {qtyErr} isRequired>
                        <FormLabel htmlFor='username'>{t('fooddrawer.inventory')}</FormLabel>
                        <NumberInput size='sm' value={quantity} min={0} onChange={e => setQuantity(e)}>
                            <NumberInputField 
                            ref={QtyRef}/>
                            <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <FormErrorMessage>{t(qtyErr)}</FormErrorMessage>
                    </FormControl>
                </Box>
                <Box>
                    <FormControl isInvalid = {priceErr} isRequired>
                        <FormLabel htmlFor='username'>{t('fooddrawer.originalP')}</FormLabel>
                        <Input
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        />
                        <FormErrorMessage>{t(priceErr)}</FormErrorMessage>
                    </FormControl>
                </Box>
                <Box>
                    <FormControl isInvalid = {dPriceErr} isRequired>
                        <FormLabel htmlFor='username'>{t('fooddrawer.discountedP')}</FormLabel>
                        <Input
                        errorBorderColor='crimson'
                        value={discountedPrice}
                        onChange={e => setDiscountedPrice(e.target.value)}
                        />
                        <FormErrorMessage>{t(dPriceErr)}</FormErrorMessage>
                    </FormControl>
                </Box>
                <Box>
                    <FormControl isInvalid = {imgErr} isRequired>
                        <FormLabel htmlFor='image'>{t('fooddrawer.img')}</FormLabel>
                        <ItemCropperModal itemImage = {initialImg} setImage = {setImage}/>
                        <FormErrorMessage>{t(imgErr)}</FormErrorMessage>
                    </FormControl>
                </Box>
                </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth='1px'>
                <Button variant='outline' mr={3} onClick={onClose}>
                {t('fooddrawer.cancel')}
                </Button>
                <Button colorScheme='blue' onClick = {item === undefined ? () => HandleSubmit() : () => HandleUpdate()}> {item === undefined ? t('fooddrawer.submit') : t('fooddrawer.update')}</Button>
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
    
    )
  }