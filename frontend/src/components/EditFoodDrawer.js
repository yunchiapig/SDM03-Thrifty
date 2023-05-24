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
    const QtyRef = React.useRef();
    const [name, setName] = useState(item?.foodInfo.name || "");
    const [nameErr, setNameErr] =useState(false)
    const [tag, setTag] = useState(item?.foodInfo.tag || addToTag || "");
    const [tagErr, setTagErr] =useState(false)
    const [quantity, setQuantity] = useState(item?.quantity || "0");
    const [qtyErr, setQtyErr] =useState(false)
    const [discountedPrice, setDiscountedPrice] = useState(item?.foodInfo.discount_price || "");
    const [dPriceErr, setDPriceErr] =useState(false)
    const [price, setPrice] = useState(item?.foodInfo.original_price || "");
    const [priceErr, setPriceErr] =useState(false)
    const [description, setDescription] = useState(item?.foodInfo.description || "");
    const [desErr, setDesErr] =useState(false)
    const [initialImg, setInitialImg] = useState(item?.foodInfo ? 'http://sdm03-thrifty.s3.ap-northeast-1.amazonaws.com/' + item.foodInfo.mainImage: undefined)
    const [image, setImage] = useState(null);
    const [imgErr, setImgErr] =useState(false)

    useEffect(() => {
        if(checkTokenExpiration()){
            navigate('/login')
        }
    }, [onOpen])

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
        if (tag == ''){
            setTagErr('signup.inputBlank')
            pass = false
        }
        else {
            setTagErr('')
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
            setPriceErr("價格格式錯誤")
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
            setDPriceErr("價格格式錯誤")
            priceCorrect = false
            pass = false
        }
        else {
            setDPriceErr('')
        }

        if(priceCorrect) {
            if(Number(price) <= Number(discountedPrice)) {
                setDPriceErr("折扣價須低於原價")
                setPriceErr("折扣價須低於原價")
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
        formData.append('mainImage', image);
        formData.append('storeID', storeInfo._id);
        let updateInfo = {
            name,
            category: "其他",
            tag,
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
                title: `已成功新增 ${name}`,
                status: 'success',
                isClosable: true,
            })
            onClose();
        })
        .catch(e => {
            setNameErr("此商品名稱已存在")
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
            formData.append('mainImage', image);
        }
        formData.append('foodID', item.foodInfo._id);
        let updateInfo = {
            name,
            category: "其他",
            tag,
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
                title: `已成功新增 ${name}`,
                status: 'success',
                isClosable: true,
            })
            onClose();
        })
        .catch(e => {
            setNameErr("此商品名稱已存在")
        });
        setLoading(false);
        
    }
    return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            initialFocusRef={certain === "qty" ? QtyRef : firstField}
            onClose={() => {
                onClose();
                setDrawerMount(false);
            }}
            
        >
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>
                新增品項
            </DrawerHeader>

            <DrawerBody>
                <Stack spacing='24px'>
                <Box>
                    <FormControl isInvalid = {nameErr} isRequired>
                        <FormLabel htmlFor='username'>品項名稱</FormLabel>
                        <Input
                        ref={firstField}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        />
                        <FormErrorMessage>{t(nameErr)}</FormErrorMessage>
                    </FormControl>
                </Box>

                <Box>
                    <FormControl isInvalid = {tagErr} isRequired>
                        <FormLabel htmlFor='owner'>自訂品項類別</FormLabel>
                        <CustomSelect tag = {tag} setTag={setTag}/>
                        <FormErrorMessage>{t(tagErr)}</FormErrorMessage>
                    </FormControl>
                </Box>

                <Box>
                    <FormControl isInvalid = {desErr} isRequired>
                        <FormLabel htmlFor='desc'>品項說明</FormLabel>
                        <Textarea id='desc' value={description}
                        onChange={e => setDescription(e.target.value)}/>
                        <FormErrorMessage>{t(desErr)}</FormErrorMessage>
                    </FormControl>
                </Box>
                <Box>
                    <FormControl isInvalid = {qtyErr} isRequired>
                        <FormLabel htmlFor='username'>庫存</FormLabel>
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
                        <FormLabel htmlFor='username'>原始價錢</FormLabel>
                        <Input
                        errorBorderColor='crimson'
                        placeholder='輸入原始價錢'
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        />
                        <FormErrorMessage>{t(priceErr)}</FormErrorMessage>
                    </FormControl>
                </Box>
                <Box>
                    <FormControl isInvalid = {dPriceErr} isRequired>
                        <FormLabel htmlFor='username'>折扣後價錢</FormLabel>
                        <Input
                        errorBorderColor='crimson'
                        placeholder='輸入折扣後價錢'
                        value={discountedPrice}
                        onChange={e => setDiscountedPrice(e.target.value)}
                        />
                        <FormErrorMessage>{t(dPriceErr)}</FormErrorMessage>
                    </FormControl>
                </Box>
                <Box>
                    <FormControl isInvalid = {imgErr} isRequired>
                        <FormLabel htmlFor='image'>圖片</FormLabel>
                        {/*<ItemCropperModal itemImage = {initialImg} setImageFile = {setImage}/>*/}
                        <Input type='file' id='image' accept="image/png, image/jpeg" onChange={e => setImage(e.target.files[0])} />
                        {(image || initialImg) && <Img src={ image == null ? initialImg : URL.createObjectURL(image)} alt='Preview' />}
                        <FormErrorMessage>{t(imgErr)}</FormErrorMessage>
                    </FormControl>
                </Box>
                </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth='1px'>
                <Button variant='outline' mr={3} onClick={onClose}>
                取消
                </Button>
                <Button colorScheme='blue' onClick = {item === undefined ? () => HandleSubmit() : () => HandleUpdate()}> {item === undefined ? "提交" : "更新"}</Button>
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
    
    )
  }