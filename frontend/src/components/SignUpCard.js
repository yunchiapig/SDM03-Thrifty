import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    Select
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  
  export default function SignupCard() {
    const [showPassword, setShowPassword] = useState(false);
  
    return (
        <Box my = '10vh' w = '80%'>
            <Box
                rounded={'lg'}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'lg'}
                p={8}>
                <Stack mb = '5vh'>
                    <Heading fontSize={'4xl'} color = '#0C692E'>
                    Sign up
                    </Heading>
                    <Text fontSize={'lg'} color='gray'>
                    to join Thrifty
                    </Text>
                </Stack>
                <Stack spacing={4}>
                <FormControl id="name" isRequired>
                    <FormLabel>Store name</FormLabel>
                    <Input />
                </FormControl>
                <FormControl id="email" isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input type="email" />
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                    <Input type={showPassword ? 'text' : 'password'} />
                    <InputRightElement h={'full'}>
                        <Button
                        variant={'ghost'}
                        onClick={() =>
                            setShowPassword((showPassword) => !showPassword)
                        }>
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                    </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Store Type</FormLabel>
                    <Select placeholder='Select type' size = 'md'>
                        <option>其他</option>
                    </Select>
                </FormControl>
                <FormControl id="phone" isRequired>
                    <FormLabel>Phone number</FormLabel>
                    <Input type = 'tel'/>
                </FormControl>
                <FormControl id="address" isRequired>
                    <FormLabel>Address</FormLabel>
                    <Input type = 'text'/>
                </FormControl>
                <Stack spacing={10} pt={2}>
                    <Button
                    loadingText="Submitting"
                    size="lg"
                    bg='#72A8DB'
                    color={'white'}
                    _hover={{
                        bg: '#85C4FF',
                    }}>
                    Sign up
                    </Button>
                </Stack>
                <Stack pt={6}>
                    <Text align={'center'}>
                    Already a in Thrifty? <Link color={'blue.400'}>Login</Link>
                    </Text>
                </Stack>
                </Stack>
            </Box>
    </Box>
    );
  }