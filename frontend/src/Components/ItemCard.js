import {
    Box,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import Rating from './Rating';

const data = {
    itemName: "夏威夷披薩",
    description: "新鮮現做，番茄、九層塔、馬札瑞拉起士",
    sellingPrice: 100,
    originalPrice: 250,
    image: "https://tokyo-kitchen.icook.network/uploads/recipe/cover/380644/d3dae1cadb3764f0.jpg",
    number: 3,
};
  
export default function ItemCard() {
    return (
        <Box py={4} px={5} minW={{ sm: '100%', md: '50%' }}>
            <Stack
                borderWidth="1px"
                borderRadius="lg"
                // w={{ sm: '100%', md: '45%vw' }}
                height={{ sm: '476px', md: '15rem' }}
                direction={{ base: 'column', md: 'row' }}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'md'}
                padding={4}>
                <Flex flex={1} bg="blue.200">
                    <Image
                    objectFit="cover"
                    boxSize="100%"
                    src={ data.image }
                    />
                </Flex>
                <Stack
                    flex={1}
                    flexDirection="column"
                    justifyContent="top"
                    alignItems="left"
                    p={1} pl={2} pt={2} 
                    spacing="12px">
                    <Heading fontSize={'xl'} fontFamily={'body'}> {data.itemName} </Heading>
                    <Text  size="sm" mb={4} color={"gray.500"}> {data.description} </Text>
                    <Box w="100%">
                        <Heading fontSize={'xl'} fontFamily={'body'} color="red.400"> ＄{data.sellingPrice} </Heading>
                        <Text  size="lg"  textDecoration="line-through" color={"red.200"}> ＄{data.originalPrice} </Text>
                    </Box>
                    <Text  size="sm" mb={4}> 庫存：{data.number} </Text>
                </Stack>
            </Stack>
        </Box>
    );
}