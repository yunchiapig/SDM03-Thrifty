import ItemCard from './ItemCard.js';
import EditFoodDrawer from './EditFoodDrawer.js';
import './button.css';
import {
    Box,
    Icon,
    Text,
    useDisclosure,
    Button
} from '@chakra-ui/react';
import { FiEdit, FiPlus } from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import instance from "../api.js";
import {useStoreAdmin} from "../hooks/useStoreAdmin";

export default ({typeStocks, r, index}) => {
    const {stocks, drawerMount, setStocks, setDrawerMount} = useStoreAdmin();
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Box bg='#EDF2F6' textAlign= 'left' w = '100%' ref={r} pb={index === stocks.length - 1 ? '50%' : '0'}>
            <Box ml = {12} mt = {8} display='flex' flexDirection='row' position='relative'>
                <Text  fontSize= '24px' textAlign = 'left'> {typeStocks.tag} </Text>
                <Button className = "iconButton" variant='ghost' onClick={() => {setDrawerMount(true); onOpen()}}>
                    <Icon as = {AiOutlinePlusCircle} ml={2} mt={2} fontSize={24} fill='gray'/>
                </Button>
                { drawerMount ? 
                <EditFoodDrawer isOpen = {isOpen} onOpen = {onOpen} onClose = {() => {onClose(); setDrawerMount(false)}} addToTag={typeStocks.tag} /> :
                null}
            </Box>
            {typeStocks.items.map(s => {
                return <ItemCard item = {s} key = {s.food._id}/>
            })}
        </Box>
    )
}