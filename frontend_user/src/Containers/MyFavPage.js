import { Box, Flex, Stack, Heading, Text } from "@chakra-ui/react"
import StoreSmallCard from "../Components/StoreSmallCard"
import Map from '../Components/Map';
import Toggle from 'react-styled-toggle';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import axios from "axios";

export default function MyFavPage({filteredValues, storesData, setOnHomePage}){
    const [filteredData, setFilteredData] = useState(storesData);
    const [filteredDoubleColData, setFilteredDoubleColData] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(()=>{
        setOnHomePage(true);
    },[])

    useEffect(()=>{
        if(!filteredValues.item.length && !filteredValues.store.length){
            setFilteredData(storesData);
            let doubleColData = storesData.reduce(function (rows, key, index) { 
                return (index % 2 === 0 ? rows.push([key]) 
                : rows[rows.length-1].push(key)) && rows;
            }, []);
            setFilteredDoubleColData(doubleColData);
        }
        else{
            let fData = storesData;
            if(filteredValues.store.length){
                fData = fData.filter((data) => filteredValues.store.includes(data.category))
            }
            if(filteredValues.item.length){
                fData = fData.filter((data) => {
                    for (const stock of data.stocks) {
                        if (filteredValues.item.includes(stock.category)) { return true;}
                    }
                    return false;
                })
                // console.log('stores:', fData)
            }
            setFilteredData(fData);
            let doubleColData = fData.reduce(function (rows, key, index) { 
                return (index % 2 === 0 ? rows.push([key]) 
                : rows[rows.length-1].push(key)) && rows;
            }, []);
            setFilteredDoubleColData(doubleColData);
        }
    }, [storesData, filteredValues])


    return(
        <Box ml={5}>
            <Box>
                <Flex>
                    {/* <SimpleSidebar/> */}
                    <Box w="100%">
                        <Stack align={'center'}>
                            <Heading fontSize={'6xl'} textAlign={'center'}>
                                {t('favorites')}
                            </Heading>
                            <Text fontSize={'lg'} color={'gray.600'}>
                                {localStorage.getItem('name')} | {localStorage.getItem('email')}
                            </Text>
                        </Stack>
                        {filteredDoubleColData.map((twoStoresData, i)=>{ return(
                        <Flex key={i}>
                            {twoStoresData.map((storeData, ii)=>{return(
                            <Flex onClick={(e)=>{
                                e.stopPropagation();
                                navigate(`/store/${storeData._id}`, 
                                    { state: { storeData: storeData } });}} 
                                w={{ sm: '100%', md: '50%' }} key={ii}>
                                {(localStorage.getItem('name') !== null)?
                                <StoreSmallCard storeData={storeData} is_favorite={localStorage.getItem('favorite_stores').includes(storeData._id)}/>:
                                <StoreSmallCard storeData={storeData} is_favorite={false}/>}
                            </Flex>
                            )})}
                        </Flex>)
                        })}
                    </Box>
                </Flex>
            </Box>
        </Box>
    )
}