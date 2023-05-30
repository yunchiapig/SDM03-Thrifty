import { Box, Flex, Image, Heading, useColorModeValue, VStack, Text, Square, HStack } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import ItemCard from "../Components/ItemCard";
// import Rating from "../Components/Rating";
import { withRouter } from "../Hooks/withRouter";
import axios from "axios";
import { useParams, useLocation } from 'react-router-dom';
import '../App.css';
const DefaultImg = require('../images/storepageDefault.png');

const StorePage = ({setOnHomePage}) => {
    let { id } = useParams();
    const [storeID, setStoreID] = useState(id);
    let location = useLocation()
    const [storeData, setStoreData] = useState(location.state.storeData);

    const [foodDataByCat, setFoodDataByCat] = useState({});
    const [foodCategories, setFoodCategories] = useState([]);

    const [width, setWidth] = useState(0)
    const [navbarHeight, setNavbarHeight] = useState(0);

    useEffect(()=>{
        setOnHomePage(false);
    }, [])

    useEffect(()=>{
        axios.get(`https://thrifty-tw.shop/api/1.0/user/foods?id=${storeID}`,  { crossdomain: true })
            .then(response => {
                var msg = response.data.message;
                // console.log(msg)
                var categories = []
                msg.forEach((foodItem)=>{
                    var cat = foodItem.food.category;
                    // if (cat === undefined){ cat = '其他';}
                    if (categories.indexOf(cat) === -1) {
                        categories.push(cat);
                    }
                })
                setFoodCategories(categories);

                var dataByCat = {};
                for (const cat of categories){
                    // refs[cat] = useRef(null);
                    var dataCatDouble = msg.filter((d)=> d.food.category===cat)
                        .reduce(function (rows, key, index) { 
                        return (index % 2 === 0 ? rows.push([key]) 
                          : rows[rows.length-1].push(key)) && rows;
                    }, []);
                    dataByCat[cat] = dataCatDouble
                }
                setFoodDataByCat(dataByCat);
            });
    }, [storeID])

    useEffect(()=>{
        var w = document.getElementById('store-large-card-components').offsetWidth
        setWidth(w/foodCategories.length)
    }, [foodCategories])

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

    function foodCompoentnsByCategories(){
        var com = [];
        if(Object.keys(foodDataByCat).length !== 0){
            for (const cat of foodCategories){
                com.push(<Heading id={`food-category-${cat}`} key={cat} fontSize='3xl' px={10} paddingTop={6} >{cat}</Heading>);
                foodDataByCat[cat].map((twoFoodData, i) =>{ 
                    com.push(
                        <>
                            <Flex w="full" key={i}>
                                {twoFoodData.map((aFood, ii)=>{return(
                                    <Flex w={{ sm: '100%', md: '50%' }} key={ii}>
                                        <ItemCard foodData={aFood}/>
                                    </Flex>
                                )})}
                            </Flex>
                        </>
                    )
                })
            }
        }
        return com;
    }

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
                <Flex flex={1}  minH={{ sm: '476px', md: '10rem' }} zIndex={10}
                    bg="white" position="relative" overflowX={"hidden"} borderBottomColor="gray"
                    w="100%" boxSizing='border-box' flexDirection="column">
                    {storeData.storepage_img_url?
                        <Image
                        position="absolute"
                        objectFit="cover"
                        boxSize="100%"
                        src={ storeData.storepage_img_url }
                        onError = {(e) => {e.target.src = DefaultImg}} />
                        :<Image
                        position="absolute"
                        objectFit="cover"
                        boxSize="100%"
                        src={ DefaultImg } />
                    }
                    
                </Flex>
                <hr
                    style={{
                        width:"100%",
                        color: "grey",
                        backgroundColor: "grey",
                    }}
                />
                <VStack
                    id="store-large-card-components"
                    flex={1} w="100%"
                    flexDirection="column"
                    justifyContent="top"
                    alignItems="left">
                    <Box  pl={20} p={6}>
                        <VStack spacing={"12px"} >
                            <Heading  fontFamily={'body'} mb={2}> {storeData.name} </Heading>
                            <Text  color={'gray.500'} size="sm" mb={4}> {storeData.address} </Text>
                            <Text  color={'gray.500'} size="sm" mb={4}> {storeData.tel} </Text>
                        </VStack>
                    </Box>
                    <Square outline={"solid lightgray"} boxShadow={'md'} id="store-classes-bar" bg={useColorModeValue('white')}
                        top={`${navbarHeight}`}  boxSizing="border-box" zIndex={1}>
                        <HStack align={'center'} p={3} w="100%" justifyContent={'space-around'}>
                            {foodCategories.map((theClass) =>
                                <Box h="100%" key={theClass} >
                                    <a key={theClass} className='food-category-menu-option'
                                        onClick = {(e)=>{
                                            e.preventDefault();
                                            window.scrollTo({
                                            top: document.querySelector(`#food-category-${theClass}`).offsetTop - 180,
                                            behavior: "smooth",})}}> 
                                        {theClass}
                                    </a>
                                </Box>
                            )}
                        </HStack>
                    </Square>

                    <Box ml={5} w="full">
                        {foodCompoentnsByCategories()}
                    </Box>
                </VStack>
            </VStack>
            <Box h="80px"></Box>
        </Box>
    )
};

export default withRouter(StorePage);