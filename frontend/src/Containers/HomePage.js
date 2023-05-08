import { Box, Flex } from "@chakra-ui/react"
import StoreSmallCard from "../Components/StoreSmallCard"
import Map from '../Components/Map';
import Toggle from 'react-styled-toggle';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function HomePage(){
    const [ifMapMode, setIfMapMode] = useState(true);
    const [storesData, setStoresData] = useState([]);
    const [storesDataforList, setStoresDataforList] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            setMapCenter({ lat: latitude, lng: longitude });
          },
          () => console.log('User location not available.')
        );
      }, []);

    useEffect(() => {
        // console.log(userLocation);
        if (mapCenter) {
            axios.get(`http://52.193.252.15/api/1.0/stores?longitude=${mapCenter.lng}&latitude=${mapCenter.lat}`,  { crossdomain: true })
                .then(response => {
                    setStoresData(response.data.message);
                    const data = response.data.message.reduce(function (rows, key, index) { 
                        return (index % 2 === 0 ? rows.push([key]) 
                        : rows[rows.length-1].push(key)) && rows;
                    }, []);
                    setStoresDataforList(data);
                });
            }
        // console.log(storesData);
    }, [mapCenter])

    const changeNewCenter = (newCenter) => {
        setMapCenter(newCenter);
    };

    console.log('mapCenter:', mapCenter)

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
                            {userLocation && (<Map userLocation={userLocation} storesData={storesData} mapCenter={mapCenter} setMapCenter={setMapCenter}/>) }
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