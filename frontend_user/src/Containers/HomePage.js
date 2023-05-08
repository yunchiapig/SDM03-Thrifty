import { Box, Flex } from "@chakra-ui/react"
import StoreSmallCard from "../Components/StoreSmallCard"
import Map from '../Components/Map';
import Toggle from 'react-styled-toggle';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
// import axios from "axios";

export default function HomePage({filteredValues, userLocation, mapCenter, setMapCenter, storesData, storesDataforList}){
    const [ifMapMode, setIfMapMode] = useState(true);
    const navigate = useNavigate();

    return(
        <Box ml={5}>
            <Flex>
                <Toggle labelLeft='Map' labelRight='List' style={{zIndex:10}}
                backgroundColorUnchecked='#82BFF3'backgroundColorChecked='#76CFCF'
                onChange={()=>{setIfMapMode(!ifMapMode)}}/>
            </Flex>
            <Box>
                <Flex>
                    {/* <SimpleSidebar/> */}
                    {ifMapMode?
                    <Flex>
                        <Box w='50%'>
                            <Map userLocation={userLocation} storesData={storesData} mapCenter={mapCenter} setMapCenter={setMapCenter}/>
                        </Box>
                        <Box w='50%'>
                            {storesData.map((storeData, i)=>{ return(
                            <Flex onClick={()=>{
                                navigate(`/store/${storeData._id}`, 
                                    { state: { storeData: storeData } });}} 
                                w={{ sm: '100%', md: '45%vw' }} key={i}>
                                <StoreSmallCard storeData={storeData}/>
                            </Flex>)
                            })}
                        </Box>
                    </Flex>:
                    <Box>
                        {storesDataforList.map((twoStoresData, i)=>{ return(
                        <Flex key={i}>
                            {twoStoresData.map((storeData, ii)=>{return(
                            <Flex onClick={()=>{
                                navigate(`/store/${storeData._id}`, 
                                    { state: { storeData: storeData } });}} 
                                w={{ sm: '100%', md: '45%vw' }} key={ii}>
                                <StoreSmallCard storeData={storeData}/>
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