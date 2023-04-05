import { Box, Flex } from "@chakra-ui/react"
import ShopInfoCard from "../Components/StoreSmallCard"
import Toggle from 'react-styled-toggle';
import { useState } from "react";


export default function HomePage(){
    const [ifMapMode, setIfMapMode] = useState(true);

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
                            <Flex>
                                <ShopInfoCard/>
                                <ShopInfoCard/>
                            </Flex>
                            <Flex>
                                <ShopInfoCard/>
                                <ShopInfoCard/>
                            </Flex>
                            <Flex>
                                <ShopInfoCard/>
                                <ShopInfoCard/>
                            </Flex>
                        </Box>
                    }
                </Flex>
            </Box>
        </Box>
    )
}