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
import { useTranslation } from 'react-i18next';
import axios from "axios";
import jwt_decode from "jwt-decode";

function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);

  const [accountName, setAccountName] = useState('');
  const handleAccountNameChange = (event) => setAccountName(event.target.value)
  const isAccountNameError = (accountName === '' || !(/^[a-zA-Z]+$/.test(accountName)))

  const [email, setEmail] = useState('');
  const handleEmailChange = (event) => setEmail(event.target.value)
  const isEmailError = (email === '' || !(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)));

  const [password, setPassword] = useState('');
  const handlePasswordChange = (event) => setPassword(event.target.value)
  const isPasswordError = (password.length < 8 || password.length > 20 || password === password.toLowerCase() || password === password.toUpperCase() || !(/\d/.test(password)))

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (event) => {
    if (!(isAccountNameError || isEmailError || isPasswordError)) {
      const userData = { 'name': accountName, 'email': email, 'password': password }
      axios.post('https://thrifty-tw.shop/api/1.0/user', userData, { crossdomain: true })
          .then(response => {
              // console.log(jwt_decode(response.data.message)); 
            })
      window.alert('Sign up successfully! Please log in.');
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
            {t('signupCard.title')}
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            {t('signupCard.subtitle')}
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
                  <FormLabel>{t('signupCard.accountName')}</FormLabel>
                  <Input type="text" value={accountName} onChange={handleAccountNameChange}/>
                </FormControl>
              </Box>
              <Box>
                <FormControl id="email" isRequired isInvalid={isEmailError}>
                  <FormLabel>{t('signupCard.emailAddress')}</FormLabel>
                  <Input type="email" value={email} onChange={handleEmailChange}/>
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="password" isRequired isInvalid={isPasswordError}>
              <FormLabel>{t('signupCard.password')}</FormLabel>
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
                  {t('signupCard.passwordValid')}
                </FormHelperText>
              ) : (
                <FormErrorMessage width={'400px'}>{t('signupCard.passwordError')}</FormErrorMessage>
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
                {t('signupCard.signupButton')}
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                {t('signupCard.alreadyaUser')} <Link color={'blue.400'} href={'/login'}>{t('signupCard.loginLink')}</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default SignupCard;