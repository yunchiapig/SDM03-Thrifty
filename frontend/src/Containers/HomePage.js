import { Box, Flex, Link } from "@chakra-ui/react"
import StoreSmallCard from "../Components/StoreSmallCard"
import Toggle from 'react-styled-toggle';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function HomePage(){
    const [ifMapMode, setIfMapMode] = useState(true);
    const [storesData, setStoresData] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get(`http://52.193.252.15/api/1.0/stores?longitude=${121.55}&latitude=${25.03}`,  { crossdomain: true })
            .then(response => {
                const data = response.data.message.reduce(function (rows, key, index) { 
                    return (index % 2 == 0 ? rows.push([key]) 
                      : rows[rows.length-1].push(key)) && rows;
                }, []);
                setStoresData(data);
            });
    }, [])

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
                        <></>:
                        <Box>
                            {storesData.map((twoStoresData, i)=>{
                                return(
                                    <Flex key={i}>
                                    {twoStoresData.map((storeData, ii)=>{
                                        return(
                                            <Flex onClick={()=>{
                                                navigate(`/store/${storeData._id}`, 
                                                    { state: { storeData: storeData } });}} 
                                                w={{ sm: '100%', md: '45%vw' }} key={ii}>
                                                <StoreSmallCard storeData={storeData}/>
                                            </Flex>
                                        )
                                    })}
                                </Flex>
                                )
                            })}
                        </Box>
                    }
                </Flex>
            </Box>
        </Box>
    )
}