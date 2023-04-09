import EditFoodDrawer from './EditFoodDrawer';
import DeletConfirm from './DeletConfirm';
import {
Button,
Avatar,
Box,
Icon,
Text,
useDisclosure,
BoxProps,
FlexProps,
Card,
CardHeader,
CardBody,
CardFooter,
Heading,
Stack,
} from '@chakra-ui/react';

import { FiTrash } from "react-icons/fi";
import { AiOutlineEdit } from "react-icons/ai";
import { TbTrashX } from "react-icons/tb";
import './button.css'
import { useState } from 'react';
import { useStoreAdmin } from '../hooks/useStoreAdmin';
import { FcAddImage } from "react-icons/fc";
//import { EditIcon } from '@chakra-ui/icons'


export default ({item}) => {
    //console.log(item)
    const { isOpen: updateIsOpen , onOpen: updateOnOpen, onClose: updateOnClose } = useDisclosure()
    const { isOpen: deleteIsOpen , onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure()
    const [ certain, setCertain] = useState(null);
    const { drawerMount, setDrawerMount} = useStoreAdmin();
    const HandleFocus = () => {
        setDrawerMount(true);
        updateOnOpen(); 
        setCertain("qty")
    }
    return(
        <>
             <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            my = {5}
            mx = {10}
            h = {170}
            w = '80%'
            >
                <Stack w = '75%'>
                    <CardBody h = '100%'>
                        <Box display = 'flex' h='35%'>
                            <Heading size='md' mr={2}>{item.food.name}</Heading>
                            <Box className = "iconButton" bottom= {2} color='white' mx = {2} onClick={() => {setDrawerMount(true); updateOnOpen()}}>
                                <Icon as={AiOutlineEdit} fontSize={18} fill='gray'/>
                            </Box>
                            { drawerMount ? 
                            <EditFoodDrawer isOpen = {updateIsOpen} onOpen = {updateOnOpen} onClose = {() => {updateOnClose(); setDrawerMount(false); setCertain(null)}} item={item} certain={certain}/> :
                            null}
                            <Box className = "iconButton2" bottom= {2} color='white' onClick={() => deleteOnOpen()}>
                                <Icon as={TbTrashX} fontSize={20} color='gray'/>
                            </Box>
                            <DeletConfirm isOpen = {deleteIsOpen} onOpen = {deleteOnOpen} onClose = {deleteOnClose} item={item}/>
                        </Box>
                        <Text w = '100%' h='45%'>
                            {/*Caffè latte is a coffee beverage of Italian origin made with espresso
                            and steamed milk.*/}
                        </Text>
                        <Box display='flex' flexDirection='row' h='20%'>
                            <Box display='flex' flexDirection='row' w = '60%'>
                                <Text as = 'b' textDecoration='line-through' color='darkgray'>${item.food.original_price}</Text>
                                <Text as = 'b' color='crimson' mx={2}>${item.food.discount_price}</Text>
                                {/*<Tag backgroundColor='#b0e0e6' mx={3} borderRadius='full'>20% off</Tag>*/}
                            </Box>
                            <Box display='flex' w='40%'>
                                <Text mx='2%' w='40%'>庫存</Text> 
                                <Box maxH={8} minW={14} borderRadius={1.5} px={1.5} boxShadow='outline' onClick={HandleFocus} cursor='pointer'>{item.quantity}</Box>
                                {/*<Text as = 'b' m={1.5}>{20}</Text> */}
                                {/*<NumberInput size='sm' maxW={14} value={item.quantity} bottom={1}h = '120%'>
                                    <NumberInputField h = '100%' w='100%'/>
                                    {/*<NumberInputStepper>
                                        <NumberIncrementStepper/>
                                        <NumberDecrementStepper/>
                                    </NumberInputStepper>
                                </NumberInput>*/}
                            </Box>
                        </Box>
                    </CardBody>
                </Stack>
                <Box h = {170} w={{ base: '100%', sm: '25%' }}   >
                    <Box
                            h='100%'
                            w='100%'
                            objectFit='cover'
                            bg='gray.300'
                            display='flex'
                            justifyContent='center'
                            alignItems='center'
                            cursor='pointer'
                    >
                        <Icon as={FcAddImage} fontSize={24} fill='gray'zIndex='1'/>
                    </Box>
                    {/*<Image
                        h='100%'
                        w='100%'
                        objectFit='cover'
                        src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                        alt='Caffe Latte'
                    />*/}
                </Box>
            </Card>
        </>
    )
}