import { Box, Flex, Stack } from "@chakra-ui/react"
import StoreSmallCard from "../Components/StoreSmallCard"
import Map from '../Components/Map';
import Toggle from 'react-styled-toggle';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import axios from "axios";

export default function HomePage({filteredValues, userLocation, mapCenter, setMapCenter, storesData, setOnHomePage}){
    const [ifMapMode, setIfMapMode] = useState(true);
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
            <Flex>
                <Toggle labelLeft={t('toggle.map')} labelRight={t('toggle.list')} style={{zIndex:10}}
                backgroundColorUnchecked='#82BFF3'backgroundColorChecked='#76CFCF'
                onChange={()=>{setIfMapMode(!ifMapMode)}}/>
            </Flex>
            <Box>
                <Flex>
                    {/* <SimpleSidebar/> */}
                    {ifMapMode?
                    <Stack w="100%" direction={{ base: "column", lg: "row" }} alignItems="stretch">
                        <Box w={{base:'100%', lg:'50%'}} h={{base:'65vw' ,lg: '70vh'}}>
                            <Map userLocation={userLocation} storesData={filteredData} mapCenter={mapCenter} setMapCenter={setMapCenter}/>
                        </Box>
                        {window.screen.width <= 821 ?
                            <Box h={5}/>:<></>}
                        <Flex w={{base:'100%', lg:'50%'}} h='75vh' overflowY={'scroll'}>
                        {/* <div style={{width:{base:'100%', md:'50%'}, height: '75vh', overflowY: 'scroll'}}> */}
                            <Box>
                                {filteredData.map((storeData, i)=>{ return(
                                    <Flex onClick={()=>{
                                        navigate(`/store/${storeData._id}`, 
                                            { state: { storeData: storeData } });}} 
                                        w={{ sm: '100%', md: '100%' }} key={i} >
                                        {(localStorage.getItem('name') !== null)?
                                        <StoreSmallCard storeData={storeData} is_favorite={localStorage.getItem('favorite_stores').includes(storeData._id)}/>:
                                        <StoreSmallCard storeData={storeData} is_favorite={false}/>}
                                    </Flex>)
                                })}
                            </Box>
                        </Flex>
                        {/* </div> */}
                    </Stack>:
                    <Box w="100%">
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
                    </Box>}
                </Flex>
            </Box>
        </Box>
    )
}