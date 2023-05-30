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
import { useTranslation } from 'react-i18next';


export default () => {
    const [items, setItems] = useState([]);
    const {stocks, selectedType, setStock, setSelectedType} = useStoreAdmin();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { t } = useTranslation();


    //const scrollRefs = useMemo(() => Array.from({ length: stocks.length }, () => createRef()), [stocks]);
    const scrollRefs =useMemo(() => {
        return stocks?.reduce((acc, obj) => {
          const index = obj.category;
          acc[index] = createRef();
          return acc;
        }, {});
      }, [stocks]);
      
    const ScrollToTop = (cat) => {
        setSelectedType(cat);
        scrollRefs[cat].current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'start'
        });
    }

    return (
        <>
        {stocks?.length === 0 ?
            <Box display='flex' justifyContent='center' alignItems='center' h='100%'>
                <Text fontSize='5xl' color='lightgrey'>{t("management.noItem")}</Text>
            </Box> : 
            <Stack divider={<StackDivider h = '100%'/>} direction = 'row' h = '100%' overflow='hidden'  >
                <Box w= '25%' h = '100%'>
                    <Box mb = {10} ml = {5} mt = {3} display = 'flex'>
                        <Text  fontSize= '26px' textAlign = 'left' >{t("management.type")}</Text>
                    </Box>
                    <Accordion overflow='scroll'>
                        {stocks?.map((s, i) => {
                            return (
                                <AccordionItem key = {s.category}>
                                    <h2>
                                    <AccordionButton bg={selectedType === s.category ? "#EDF2F6": 'white'}>
                                    <Box as="span" flex='1' textAlign='left' display= 'flex' alignItems='center' h = {10} pl = {3} key={s.category} onClick = {() => ScrollToTop(s.category)}>
                                        {s.category}
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
                                <TypeCard typeStocks = {t} r = {scrollRefs[t.category]} key={t.category}/>
                            )
                        })}
                    </VStack>
                </Box>
            </Stack> }
    </> 
    )
}