import { Box, Flex, Stack, Image, Heading, useColorModeValue, VStack, Text } from "@chakra-ui/react";
import Rating from "../Components/Rating";

const data = {
    shopName: "披薩有張臉 Pizza Has a Face",
    address: "台北市大同區延平北路二段28號",
    imageURL: "https://img.ltn.com.tw/Upload/health/page/800/2022/10/16/phpQxGSMt.jpg",
    rating: 4.2,
    numReviews: 34,
};

export default function StorePage(){

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
                    flex={1} w="100%"
                    flexDirection="column"
                    justifyContent="top"
                    alignItems="left"
                    p={6} pl={20} spacing={"12px"}>
                    <Heading fontSize={'2xl'} fontFamily={'body'}> {data.shopName} </Heading>
                    <Text  color={'gray.500'} size="sm" mb={4}> {data.address} </Text>
                    <Rating rating={data.rating} numReviews={data.numReviews}></Rating>

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