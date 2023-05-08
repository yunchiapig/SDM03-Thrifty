import {
    Box,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
// import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
// import Rating from './Rating';

// const data = {
//     shopName: "披薩有張臉 Pizza Has a Face",
//     address: "台北市大同區延平北路二段28號",
//     imageURL: "https://img.ltn.com.tw/Upload/health/page/800/2022/10/16/phpQxGSMt.jpg",
//     rating: 4.2,
//     numReviews: 34,
// };
const imageURL = "https://images.1111.com.tw/discussPic/63/51562263_97023180.2701459.jpg" 

export default function StoreSmallCard({storeData}) {

    return (
        <Box py={4} px={5} w={{ sm: '100%', md: '45%vw' }}>
            <Stack
                borderWidth="1px"
                borderRadius="lg"
                w={{ sm: '100%', md: '45%vw' }}
                height={{ sm: '476px', md: '15rem' }}
                direction={{ base: 'column', md: 'row' }}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'md'}
                padding={4}>
                <Flex flex={1} bg="blue.200">
                    <Image
                        objectFit="cover"
                        boxSize="100%"
                        src={ imageURL }
                    />
                </Flex>
                <Stack
                    flex={1}
                    flexDirection="column"
                    justifyContent="top"
                    alignItems="left"
                    p={1}
                    pt={2}>
                    <Heading fontSize={'2xl'} fontFamily={'body'} pb={3}> {storeData.name} </Heading>
                    {/* <Rating rating={4} numReviews={32}></Rating> */}
                    <Text  color={'gray.500'} size="sm" mb={4}> {storeData.address} </Text>
                    <Text  color={'gray.500'} size="sm" mb={4}> {storeData.tel} </Text>
                </Stack>
            </Stack>
        </Box>
    );
}