import { Box, Flex, Stack, Image, Heading, useColorModeValue, VStack, Text, Square, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ItemCard from "../Components/ItemCard";
import Rating from "../Components/Rating";

const data = {
    shopName: "披薩有張臉 Pizza Has a Face",
    address: "台北市大同區延平北路二段28號",
    phone: "(02)25557759",
    imageURL: "https://img.ltn.com.tw/Upload/health/page/800/2022/10/16/phpQxGSMt.jpg",
    rating: 4.2,
    numReviews: 34,
    classes:['炸物', '沙拉', '湯品', '鹹比薩', '甜比薩'],
    items: [1,2,3,4,5,6,7,8],
};

export default function StorePage(){
    const [width, setWidth] = useState(0)
    const [navbarHeight, setNavbarHeight] = useState(0);

    useEffect(()=>{
        var w = document.getElementById('store-large-card-components').offsetWidth
        setWidth(w/data.classes.length)
    })
    useEffect(()=>{
        window.onscroll = ()=>myFunction();
        var header = document.getElementById("store-classes-bar");
        var sticky = header.offsetTop;
        var navbar = document.getElementById('navbar');
        var navbarBottom = navbar.offsetHeight;
        function myFunction() {
            if (window.pageYOffset > (sticky - navbarBottom)) {
                header.classList.add("sticky");
                setNavbarHeight(navbarBottom);
            } else {
                header.classList.remove("sticky");
                setNavbarHeight('auto');
            }
        }
    })

    return(
        <Box py={4} px={{ sm: '0', md: "10rem"}} >
            <VStack
                borderWidth="1px"
                borderRadius="lg"
                // w={{ sm: '100%', md: '45%vw' }}
                minH={{ sm: '476px', md: '50rem' }}
                direction={{ base: 'column', md: 'row' }}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'md'}>
                <Flex flex={1} 
                    bg="blue.200" position="relative" overflowX={"hidden"} 
                    w="100%" boxSizing='border-box' flexDirection="column">
                    <Image
                        position="absolute"
                        objectFit="cover"
                        boxSize="100%"
                        src={ data.imageURL }/>
                </Flex>
                <VStack
                    id="store-large-card-components"
                    flex={1} w="100%"
                    flexDirection="column"
                    justifyContent="top"
                    alignItems="left">
                    <Box  pl={20} p={6}>
                        <VStack spacing={"12px"} >
                            <Heading fontSize={'2xl'} fontFamily={'body'}> {data.shopName} </Heading>
                            <Rating rating={data.rating} numReviews={data.numReviews}></Rating>
                            <Text  color={'gray.500'} size="sm" mb={4}> {data.address} </Text>
                            <Text  color={'gray.500'} size="sm" mb={4}> {data.phone} </Text>
                        </VStack>
                    </Box>
                    
                    <Square outline={"solid lightgray"} boxShadow={'md'} id="store-classes-bar" bg={useColorModeValue('white')}
                        top={`${navbarHeight}`} w={`${width * data.classes.length}px`} >
                        <HStack align={'center'} p={3} w="100%">
                            {data.classes.map((theClass) =>
                                <Box w={`${width}px`} h="100%" key={theClass} >
                                    <Text  size="sm" key={theClass} w="full" textAlign="center" > {theClass} </Text>
                                </Box>
                            )}
                        </HStack>
                    </Square>

                    <Box ml={5} w="full">
                        <Flex w="full">
                            <ItemCard/>
                            <ItemCard/>
                        </Flex> 
                        <Flex w="full">
                            <ItemCard/>
                            <ItemCard/>
                        </Flex> 
                        <Flex w="full">
                            <ItemCard/>
                            <ItemCard/>
                        </Flex> 
                        <Flex w="full">
                            <ItemCard/>
                            <ItemCard/>
                        </Flex> 
                        {/* {data.items.map((id)=>{
                            <Flex key={id} w="full">
                                <ItemCard/>
                                <ItemCard/>
                            </Flex>    
                        })} */}
                    </Box>
                </VStack>
            </VStack>
        </Box>
    )
    
};

// text-align: left;
    // margin-top: 2rem;
    // background-color: rgb(213, 229, 243);
    // width: 70%;
    // height: auto;
    // display: inline-block;
    // vertical-align: middle;