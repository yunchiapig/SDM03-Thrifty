import ItemCard from '../components/ItemCard';
import React, { ReactNode, useState, useEffect, useRef, useMemo, createRef } from 'react';
import EditFoodDrawer from '../components/EditFoodDrawer';
import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Card,
    CardHeader,
    CardBody,
    Heading,
    Stack,
    StackDivider,
    Divider,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Button
} from '@chakra-ui/react';

import { FiEdit, FiPlus } from "react-icons/fi";
import instance from "../api.js";
import {useStoreAdmin} from "../hooks/useStoreAdmin";
import TypeCard from '../components/TypeCard';


export default () => {
    const [items, setItems] = useState([]);
    const {stocks, selectedType, setStock, setSelectedType} = useStoreAdmin();
    const { isOpen, onOpen, onClose } = useDisclosure()


    //const scrollRefs = useMemo(() => Array.from({ length: stocks.length }, () => createRef()), [stocks]);
    const scrollRefs =useMemo(() => {
        return stocks?.reduce((acc, obj) => {
          const index = obj.tag;
          acc[index] = createRef();
          return acc;
        }, {});
      }, [stocks]);
    const ScrollToTop = (tag) => {
        setSelectedType(tag);
        scrollRefs[tag].current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'start'
        });
    }

    return (
        <>
        {stocks?.length === 0 ?
            <Box display='flex' justifyContent='center' alignItems='center' h='100%'>
                <Text fontSize='5xl' color='lightgrey'>尚無品項資訊</Text>
            </Box> : 
            <Stack divider={<StackDivider h = '100%'/>} direction = 'row' h = '100%' overflow='hidden'  >
                <Box w= '25%' h = '100%'>
                    <Box mb = {10} ml = {5} mt = {3} display = 'flex'>
                        <Text  fontSize= '26px' textAlign = 'left' >商品類別</Text>
                    </Box>
                    <Accordion overflow='scroll'>
                        {stocks?.map((s, i) => {
                            return (
                                <AccordionItem key = {s.tag}>
                                    <h2>
                                    <AccordionButton bg={selectedType === s.tag ? "#EDF2F6": 'white'}>
                                    <Box as="span" flex='1' textAlign='left' display= 'flex' alignItems='center' h = {10} pl = {3} key={s.tag} onClick = {() => ScrollToTop(s.tag)}>
                                        {s.tag}
                                    </Box>
                                    </AccordionButton>
                                    </h2>
                                </AccordionItem>
                            )
                        })}
                        
                    </Accordion>
                </Box>
                <Box w= '75%' h = '100%' ml = {-2} overflow='scroll'>
                    <VStack
                        spacing={2}
                        align='stretch'
                        w = '100%'
                    >
                        {stocks?.map((t) => {
                            return (
                                <TypeCard typeStocks = {t} r = {scrollRefs[t.tag]} key={t.tag}/>
                            )
                        })}
                    </VStack>
                </Box>
            </Stack> }
    </>
    
        
    )
}