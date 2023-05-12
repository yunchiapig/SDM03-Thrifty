import { Box, Flex, Image, Heading, useColorModeValue, VStack, Text, Square, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ItemCard from "../Components/ItemCard";
// import Rating from "../Components/Rating";
import { withRouter } from "../Hooks/withRouter";
import axios from "axios";
import { useParams, useLocation } from 'react-router-dom';
import '../App.css';

const imageURL = {
    "Family": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/FamilyMart_Logo_%282016-%29.svg/1280px-FamilyMart_Logo_%282016-%29.svg.png",
    "711": "https://corp.7-eleven.com/images/media_assets/7_Eleven_Horizontal_2022_RGB_1639377127_8977.jpg",
    "others": "https://pics.craiyon.com/2023-05-09/756e18f59e1d499a8eba020cb4106f00.webp"
}

const StorePage = () => {
    let { id } = useParams();
    const [storeID, setStoreID] = useState(id);
    let location = useLocation()
    const [storeData, setStoreData] = useState(location.state.storeData);
    var url = imageURL['others']
    if (storeData.category === "全家") {url = imageURL['Family']}
    else if (storeData.category === "7-11") { url = imageURL['711']}

    const [foodData, setFoodData] = useState([]);
    const [foodCategories, setFoodCategories] = useState([]);

    const [width, setWidth] = useState(0)
    const [navbarHeight, setNavbarHeight] = useState(0);

    useEffect(()=>{
        axios.get(`http://52.193.252.15/api/1.0/foods?id=${storeID}`,  { crossdomain: true })
            .then(response => {
                var categories = []
                response.data.message.forEach((foodItem)=>{
                    if (categories.indexOf(foodItem.food.category) === -1) {
                        categories.push(foodItem.food.category);
                    }
                })
                setFoodCategories(categories);

                const data = response.data.message.reduce(function (rows, key, index) { 
                    return (index % 2 === 0 ? rows.push([key]) 
                      : rows[rows.length-1].push(key)) && rows;
                }, []);
                setFoodData(data);
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
                    <Image
                        position="absolute"
                        objectFit="cover"
                        boxSize="100%"
                        src={ url }/>
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
                            <Heading fontSize={'2xl'} fontFamily={'body'}> {storeData.name} </Heading>
                            <Text  color={'gray.500'} size="sm" mb={4}> {storeData.address} </Text>
                            <Text  color={'gray.500'} size="sm" mb={4}> {storeData.tel} </Text>
                        </VStack>
                    </Box>
                    <Square outline={"solid lightgray"} boxShadow={'md'} id="store-classes-bar" bg={useColorModeValue('white')}
                        top={`${navbarHeight}`}  boxSizing="border-box">
                        <HStack align={'center'} p={3} w="100%" justifyContent={'space-around'}>
                            {foodCategories.map((theClass) =>
                                <Box h="100%" key={theClass} >
                                    <Text  size="sm" key={theClass} w="full" textAlign="center" > {theClass} </Text>
                                </Box>
                            )}
                        </HStack>
                    </Square>

                    <Box ml={5} w="full">
                        {foodData?
                            foodData.map((twoFoodData, i) =>{ return(
                                <Flex w="full" key={i}>
                                    {twoFoodData.map((aFood, ii)=>{return(
                                        <Flex w={{ sm: '100%', md: '50%' }} key={ii}>
                                            <ItemCard foodData={aFood}/>
                                        </Flex>
                                    )})}
                                </Flex>
                            )})
                        : <></>}
                    </Box>
                </VStack>
            </VStack>
        </Box>
    )
};

export default withRouter(StorePage);