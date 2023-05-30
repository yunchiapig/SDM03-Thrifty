import {
    Box,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Heart from "react-animated-heart";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { use } from 'i18next';
const DefaultImg = require('../images/mainpageDefault.png');

// import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
// import Rating from './Rating';

// const imageURL = {
//     'Family': "https://images.1111.com.tw/discussPic/63/51562263_97023180.2701459.jpg",
//     '711': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/7-eleven_logo.svg/250px-7-eleven_logo.svg.png",
//     'others': "https://pics.craiyon.com/2023-05-09/756e18f59e1d499a8eba020cb4106f00.webp"
// }

export default function StoreSmallCard({storeData, is_favorite}) {
    // let is_favorite = false;
    // if (isLoggedIn) {
    //     if (localStorage.getItem('favorite_stores').includes(storeData._id)) {
    //         is_favorite = true;
    //     }
    // }
    // console.log(is_favorite);
    const [isClick, setClick] = useState(false);
    useEffect(() => {
        setClick(is_favorite);
    }, [is_favorite]);

    // console.log(isClick);
    
    function handleHeartClick(e) {
        e.stopPropagation();
        setClick(!isClick);
        let favorite_stores = localStorage.getItem('favorite_stores');
        if (!isClick) {
            favorite_stores += storeData._id;
            localStorage.setItem('favorite_stores', favorite_stores);
            const data = { "userID": localStorage.getItem('_id'), "storeID": storeData._id, "type": "add" };
            // console.log(data);
            axios.put('https://thrifty-tw.shop/api/1.0/user/fav', data, { crossdomain: true })
                .then(response => {
                    // console.log(jwt_decode(response.data.message));
                    // setCurrentUserInfo(jwt_decode(response.data.message));
                })
                .catch(error => { console.log(error);});
        }
        else {
            favorite_stores = favorite_stores.replace(storeData._id, '');
            localStorage.setItem('favorite_stores', favorite_stores);
            const data = { "userID": localStorage.getItem('_id'), "storeID": storeData._id, "type": "remove" };
            // console.log(data);
            axios.put('https://thrifty-tw.shop/api/1.0/user/fav', data, { crossdomain: true })
                .then(response => {
                    // console.log(jwt_decode(response.data.message));
                    // setCurrentUserInfo(jwt_decode(response.data.message));
                })
                .catch(error => { console.log(error);});
        }
    }

    // var url = imageURL['others']
    // if (storeData.category === "全家") {url = imageURL['Family']}
    // else if (storeData.category === "7-11") { url = imageURL['711']}
    // else { url = imageURL['others']}

    return (
        <Box py={4} px={5} w={{ sm: '100%', md: '100%' }}>
            <Stack
                borderWidth="1px"
                borderRadius="lg"
                minW={{ sm: '100%', md: '100%' }}
                height={{ sm: '476px', md: '15rem' }}
                direction={{ base: 'column', md: 'row' }}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'md'}
                padding={4}>
                <Flex flex={1} bg="blue.200">
                    {storeData.mainpage_img_url?
                        <Image
                            objectFit="cover"
                            boxSize="100%"
                            src={ storeData.mainpage_img_url }
                            onError = {(e) => {e.target.src = DefaultImg}}
                        />:
                        <Image
                            objectFit="cover"
                            boxSize="100%"
                            src={ DefaultImg }/>
                    }
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
                {(localStorage.getItem("name") !== null) && (
                <Flex>
                    <Heart isClick={isClick} onClick={handleHeartClick} />
                </Flex>
                )}
            </Stack>
        </Box>
    );
}