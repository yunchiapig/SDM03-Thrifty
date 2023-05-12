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
    FormLabel,
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



export default ({ isOpen, onOpen, onClose, item, certain, addToTag}) => {
    const toast = useToast()
    const {store, stocks, setStocks, loading, setLoading, setDrawerMount, getItems} = useStoreAdmin();
    const firstField = React.useRef();
    const QtyRef = React.useRef();
    const [name, setName] = useState(item?.food.name || "");
    const [tag, setTag] = useState(item?.food.tag || addToTag || "");
    const [quantity, setQuantity] = useState(item?.quantity || 0);
    const [discountedPrice, setDiscountedPrice] = useState(item?.food.discount_price || "");
    const [price, setPrice] = useState(item?.food.original_price || "");
    const [description, setDescription] = useState(item?.food.description || "");
    const [initialImg, setInitialImg] = useState(item?.food ? 'https://sdm03-thrifty.s3.ap-northeast-1.amazonaws.com/' + item.food.mainImage: null)
    const [image, setImage] = useState(null);

    const [disable, setDisable] = useState(false)
    const [submit, setSubmit] = useState(false);
    const [exist, setExist] = useState(false);
    const [priceErr, setPriceErr] = useState(false);
    //const [exist, setExist] = useState(false);
    //const existList = useState([]);
    const formCheck = () => { 
        setSubmit(true);
        if(name != "" && tag != "" && quantity !== "" && price != "" && discountedPrice != "") {
            /*if(typeof parseInt(price) === Int) {
                setPriceErr(true)
                toast({
                    title: "原始價格格式錯誤",
                    status: 'error',
                    isClosable: true,
                })
                return false
            }*/
            return true

        }
        else {
            return false
        }
    }
    const HandleSubmit = async() => {
        if (formCheck() === true) {
            setLoading(true);
            setDisable(true);
            const storeInfo = JSON.parse(localStorage.getItem('store_info'));
            const jwt = localStorage.getItem('jwt')
            let formData = new FormData();
            formData.append('mainImage', image);
            formData.append('storeID', storeInfo.storeID);
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
                    storeID: storeInfo.storeID,
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
                if(e.response?.status === 400) {
                    toast({
                        title: `${e.response.data.message}`,
                        status: 'error',
                        isClosable: true,
                    })
                    setExist(true)
                    setDisable(false)
                }
            });
            setLoading(false);
        }
        
    }

    const HandleUpdate = async() => {
        if (formCheck() === true) {
            setLoading(true);
            setDisable(true);
            const storeInfo = JSON.parse(localStorage.getItem('store_info'));
            const jwt = localStorage.getItem('jwt')
            console.log(storeInfo)
            console.log(jwt)
            let formData = new FormData();
            formData.append('mainImage', image);
            formData.append('storeID', storeInfo.storeID);
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
                    storeID: storeInfo.storeID,
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
                if(e.response?.status === 400) {
                    toast({
                        title: `${e.response.data.message}`,
                        status: 'error',
                        isClosable: true,
                    })
                    setExist(true)
                    setDisable(false)
                }
            });
            setLoading(false);
        }
        /*if (formCheck() === true) {
            const {data, status}
            = await instance.put('api/1.0/admin/food', { 
                    foodID: item.food._id,
                    updateInfo: {
                        name,
                        category: "其他",
                        tag,
                        original_price: price,
                        discount_price: discountedPrice
                    }
            })
            const submittedItem = data.data

            if (status === 200) {
                await instance.put('api/1.0/admin/stock', {
                    storeID: store,
                    foodID: submittedItem._id,
                    updateQty: quantity
                })
                await getItems();
                toast({
                    title: `已成功更新 ${submittedItem.name}`,
                    status: 'success',
                    isClosable: true,
                })
                onClose();
            }
        }*/
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
                    <FormLabel htmlFor='username'>品項名稱</FormLabel>
                    <Input
                    isInvalid = {submit && (name === "" || exist)}
                    errorBorderColor='crimson'
                    ref={firstField}
                    placeholder='輸入品項名稱'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    />
                </Box>

                <Box>
                    <FormLabel htmlFor='owner'>自訂品項類別</FormLabel>
                    <CustomSelect tag = {tag} setTag={setTag} submit = {submit}/>
                </Box>

                <Box>
                    <FormLabel htmlFor='desc'>品項說明</FormLabel>
                    <Textarea id='desc' value={description}
                    onChange={e => setDescription(e.target.value)}/>
                </Box>
                <Box>
                    <FormLabel htmlFor='username'>庫存</FormLabel>
                    <NumberInput size='sm' value={quantity} min={0} onChange={e => setQuantity(e)}
                        isInvalid = {submit && quantity === ""}
                        errorBorderColor='crimson'>
                        <NumberInputField 
                        ref={QtyRef}/>
                        <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </Box>
                <Box>
                    <FormLabel htmlFor='username'>原始價錢</FormLabel>
                    <Input
                    isInvalid = {submit && price === ""}
                    errorBorderColor='crimson'
                    placeholder='輸入原始價錢'
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    />
                </Box>
                <Box>
                    <FormLabel htmlFor='username'>折扣後價錢</FormLabel>
                    <Input
                    isInvalid = {submit && discountedPrice === ""}
                    errorBorderColor='crimson'
                    placeholder='輸入折扣後價錢'
                    value={discountedPrice}
                    onChange={e => setDiscountedPrice(e.target.value)}
                    />
                </Box>
                <Box>
                    <FormLabel htmlFor='image'>圖片</FormLabel>
                    <Input type='file' id='image' accept="image/png, image/jpeg" onChange={e => setImage(e.target.files[0])} />
                    {(image || initialImg) && <Img src={ image == null ? initialImg : URL.createObjectURL(image)} alt='Preview' />}
                </Box>
                </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth='1px'>
                <Button variant='outline' mr={3} onClick={onClose} isDisabled={disable}>
                取消
                </Button>
                <Button colorScheme='blue' onClick = {item === undefined ? () => HandleSubmit() : () => HandleUpdate()} isDisabled={disable}> {item === undefined ? "提交" : "更新"}</Button>
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
    
    )
  }