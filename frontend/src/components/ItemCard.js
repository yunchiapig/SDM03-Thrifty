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
    Image
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
    const { isOpen: updateIsOpen , onOpen: updateOnOpen, onClose: updateOnClose } = useDisclosure()
    const { isOpen: updateIsOpen2 , onOpen: updateOnOpen2, onClose: updateOnClose2 } = useDisclosure()
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
            variant='outline'
            my = {5}
            mx = {10}
            h = {{base: '250px', xl:'205px'}}
            w = {{base: '450px',lg: '550px',xl: '80%'}}
            display='grid'
            gridTemplateColumns =  {{base: 'auto 180px',xl: 'auto 240px'}}
            >
                <Stack>
                    <CardBody h = '100%' display='grid' gridTemplateRows =  {{base: '40px 145px 65px', xl: '40px 100px 65px'}}>
                        <Box display = 'flex'>
                            <Heading size='md' mr={2}>{item.foodInfo.name}</Heading>
                            <Box  display = {{base: 'none', xl: 'flex'}}>
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
                        </Box>
                        <Box overflow='scroll' mb = '15px'>
                            <Text w = '90%' color='gray.600'>
                                {item.foodInfo?.description}
                            </Text>
                        </Box>
                        <Box display='flex'  flexDirection= 'row'>
                            <Box display='flex' flexDirection='row'>
                                <Text as = 'b' textDecoration='line-through' color='darkgray'  mr={2}>${item.foodInfo.original_price}</Text>
                                <Text as = 'b' color='crimson'>${item.foodInfo.discount_price}</Text>
                                {/*<Tag backgroundColor='#b0e0e6' mx={3} borderRadius='full'>20% off</Tag>*/}
                            </Box>
                            <Box display='flex' justifyContent='flex-end' w = 'full'>
                                <Text mr = '3' as = 'b' color = '#084B8A'>庫存</Text> 
                                <Box maxH={8} minW={14} borderRadius={1.5} px={1.5} boxShadow='outline' onClick={HandleFocus} cursor='pointer'>{item.quantity}</Box>
                            </Box>
                        </Box>
                    </CardBody> 
                </Stack>
                <Box  h = {{base: '250px', xl:'205px'}} w= {{lg: '180px', xl:'230px'}} float= 'right' display = 'flex' flexDirection = 'column' justifyContent={{base: 'space-between', xl: 'center'}} py = {{base: '30px', xl: '0'}}alignItems='center' overflow='hidden'>
                    <Box display = {{base: 'flex', xl:'none'}} mb = '10px'>
                        <Box className = "iconButton" bottom= {2} color='white' mx = {2} onClick={() => {setDrawerMount(true); updateOnOpen()}}>
                            <Icon as={AiOutlineEdit} fontSize={18} fill='gray'/>
                        </Box>
                        { drawerMount ? 
                        <EditFoodDrawer isOpen = {updateIsOpen2} onOpen = {updateOnOpen2} onClose = {() => {updateOnClose2(); setDrawerMount(false); setCertain(null)}} item={item} certain={certain}/> :
                        null}
                        <Box className = "iconButton2" bottom= {2} color='white' onClick={() => deleteOnOpen()}>
                            <Icon as={TbTrashX} fontSize={20} color='gray'/>
                        </Box>
                        <DeletConfirm isOpen = {deleteIsOpen} onOpen = {deleteOnOpen} onClose = {deleteOnClose} item={item}/>
                    </Box>
                    <Image
                        h={{base: '136px', xl: '180px'}}
                        w={{base: '170px', xl: '225px'}}
                        objectFit='cover'
                        src= { item.foodInfo.img_url}
                        alt= {item.foodInfo.name}
                    />
                </Box>
            </Card>
        </>
    )
}