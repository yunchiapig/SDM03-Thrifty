import {
    Box,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
const DefaultImg = require('../images/foodImgDefault.png')
// import Rating from './Rating';


// const imageURL = "https://img.craiyon.com/2023-05-09/768ea19460d4429d8ffdafae96f47783.webp"
// "https://www.7-11.com.tw/freshfoods/1_Ricerolls/images/ricerolls_266.png";

  
export default function ItemCard(foodData) {
    const [foodInfo, setFoodInfo] = useState(foodData.foodData);

    return (
        <Box py={4} px={5} w={{ sm: '100%', md: '100%' }}>
            <Stack
                borderWidth="1px"
                borderRadius="lg"
                // w={{ sm: '100%', md: '45%vw' }}
                minH={{ sm: '476px', md: '15rem' }}
                direction={{ base: 'column', md: 'row' }}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'md'}
                padding={4}>
                <Flex flex={1} bg="blue.200">
                    {foodInfo.food.img_url?
                        <Image
                            objectFit="cover"
                            boxSize="100%"
                            src={ foodInfo.food.img_url }
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
                    p={1} pl={2} pt={2} 
                    spacing="12px">
                    <Heading fontSize={'xl'} fontFamily={'body'}> {foodInfo.food.name} </Heading>
                    {foodInfo.food.description?
                        <Text  size="sm" mb={4} color="gray"> {foodInfo.food.description} </Text>
                        :<></>
                    }
                    <Box w="100%">
                        {foodInfo.food.discount_price?
                            <>
                            <Heading fontSize={'xl'} fontFamily={'body'} color="red.400"> ＄{foodInfo.food.discount_price} </Heading>
                            <Text size="lg"  textDecoration="line-through" color={"red.200"}> ＄{foodInfo.food.original_price} </Text>
                            </>:
                            <Heading fontSize={'xl'} fontFamily={'body'} color="red.400">特價：{foodInfo.food.discount_rate} </Heading>
                        }
                    </Box>
                    <Text  size="sm" mb={4} bottom={0}position="relative"> 庫存：{foodInfo.quantity} </Text>
                </Stack>
            </Stack>
        </Box>
    );
}