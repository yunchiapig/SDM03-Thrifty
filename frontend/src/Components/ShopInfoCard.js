import {
    Badge,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    Link,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';

const data = {
    shopName: "披薩有張臉 Pizza Has a Face",
    address: "台北市大同區延平北路二段28號",
    imageURL: "https://img.ltn.com.tw/Upload/health/page/800/2022/10/16/phpQxGSMt.jpg",
    rating: 4.2,
    numReviews: 34,
};

interface RatingProps {
    rating: number;
    numReviews: number;
}
function Rating({ rating, numReviews }: RatingProps) {
    return (
      <Flex d="flex" >
        {Array(5)
          .fill('')
          .map((_, i) => {
            const roundedRating = Math.round(rating * 2) / 2;
            if (roundedRating - i >= 1) {
              return (
                <BsStarFill
                  key={i}
                  style={{ marginLeft: '1' }}
                  color={i < rating ? 'teal.500' : 'gray.300'}
                />
              );
            }
            if (roundedRating - i === 0.5) {
              return <BsStarHalf key={i} style={{ marginLeft: '1' }} />;
            }
            return <BsStar key={i} style={{ marginLeft: '1' }} />;
          })}
        <Box as="span" ml="2" color="gray.600" fontSize="sm">
          {numReviews} review{numReviews > 1 && 's'}
        </Box>
      </Flex>
    );
}
  
export default function ShopInfoCard() {
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
                    src={ data.imageURL }
                    />
                </Flex>
                <Stack
                    flex={1}
                    flexDirection="column"
                    justifyContent="top"
                    alignItems="left"
                    p={1}
                    pt={2}>
                    <Heading fontSize={'2xl'} fontFamily={'body'}> {data.shopName} </Heading>
                    <Rating rating={data.rating} numReviews={data.numReviews}></Rating>
                    <Text  color={'gray.500'} size="sm" mb={4}> {data.address} </Text>

                    {/* <Text
                        textAlign={'center'}
                        color={useColorModeValue('gray.700', 'gray.400')}
                        px={3}>
                        Actress, musician, songwriter and artist. PM for work inquires or
                        <Link href={'#'} color={'blue.400'}>
                            #tag
                        </Link>
                        me in your posts
                    </Text> */}
                    {/* <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
                        <Badge
                            px={2}
                            py={1}
                            bg={useColorModeValue('gray.50', 'gray.800')}
                            fontWeight={'400'}>
                            #art
                        </Badge>
                        <Badge
                            px={2}
                            py={1}
                            bg={useColorModeValue('gray.50', 'gray.800')}
                            fontWeight={'400'}>
                            #photography
                        </Badge>
                        <Badge
                            px={2}
                            py={1}
                            bg={useColorModeValue('gray.50', 'gray.800')}
                            fontWeight={'400'}>
                            #music
                        </Badge>
                    </Stack> */}
        
                    {/* <Stack
                        width={'100%'}
                        mt={'2rem'}
                        direction={'row'}
                        padding={2}
                        justifyContent={'space-between'}
                        alignItems={'center'}>
                        <Button
                            flex={1}
                            fontSize={'sm'}
                            rounded={'full'}
                            _focus={{
                            bg: 'gray.200',
                            }}>
                            Message
                        </Button>
                        <Button
                            flex={1}
                            fontSize={'sm'}
                            rounded={'full'}
                            bg={'blue.400'}
                            color={'white'}
                            boxShadow={
                            '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                            }
                            _hover={{
                            bg: 'blue.500',
                            }}
                            _focus={{
                            bg: 'blue.500',
                            }}>
                            Follow
                        </Button>
                    </Stack> */}
                </Stack>
            </Stack>
        </Box>
    );
}