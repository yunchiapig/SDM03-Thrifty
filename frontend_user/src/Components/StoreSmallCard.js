import {
    Box,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
// import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
// import Rating from './Rating';


const imageURL = {
    'Family': "https://images.1111.com.tw/discussPic/63/51562263_97023180.2701459.jpg",
    '711': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/7-eleven_logo.svg/250px-7-eleven_logo.svg.png",
    'others': "https://pics.craiyon.com/2023-05-09/756e18f59e1d499a8eba020cb4106f00.webp"
}

export default function StoreSmallCard({storeData}) {
    var url = imageURL['others']
    if (storeData.category === "全家") {url = imageURL['Family']}
    else if (storeData.category === "7-11") { url = imageURL['711']}

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
                    <Image
                        objectFit="cover"
                        boxSize="100%"
                        src={ url }
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