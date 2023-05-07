import {
  Flex,
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
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
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import jwt_decode from "jwt-decode";

function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);

  const [accountName, setAccountName] = useState('');
  const handleAccountNameChange = (event) => setAccountName(event.target.value)
  const isAccountNameError = (accountName === '' || !(/^[a-zA-Z]+$/.test(accountName)))

  const [email, setEmail] = useState('');
  const handleEmailChange = (event) => setEmail(event.target.value)
  const isEmailError = email === ''

  const [password, setPassword] = useState('');
  const handlePasswordChange = (event) => setPassword(event.target.value)
  const isPasswordError = (password.length < 8 || password.length > 20 || password === password.toLowerCase() || password === password.toUpperCase() || !(/\d/.test(password)))

  const [currentUser, setCurrentCenter] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    if (!(isAccountNameError || isEmailError || isPasswordError)) {
      const userData = { 'name': accountName, 'email': email, 'password': password }
      axios.post('http://52.193.252.15/api/1.0/user', userData, { crossdomain: true })
          .then(response => { console.log(jwt_decode(response.data.message)); })
      navigate('/login');
    }
  }

  return (
    <Flex
      minH={'50vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('transparent', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'xl'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="accountName" isRequired isInvalid={isAccountNameError}>
                  <FormLabel>Account Name</FormLabel>
                  <Input type="text" value={accountName} onChange={handleAccountNameChange}/>
                </FormControl>
              </Box>
              <Box>
                <FormControl id="email" isRequired isInvalid={isEmailError}>
                  <FormLabel>Email address</FormLabel>
                  <Input type="email" value={email} onChange={handleEmailChange}/>
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="password" isRequired isInvalid={isPasswordError}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange} placeholder="Password should contain 8 to 20 characters."/>
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
              {!isPasswordError ? (
                <FormHelperText>
                  Valid password.
                </FormHelperText>
              ) : (
                <FormErrorMessage>Password should contain 8 to 20 characters, with at least one numeric digit, one uppercase and one lowercase letter.</FormErrorMessage>
              )}
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSubmit}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link color={'blue.400'} href={'/login'}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default SignupCard;