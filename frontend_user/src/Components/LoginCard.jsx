import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Logo } from './Logo.jsx'
import { OAuthButtonGroup } from './OAuthButtonGroup.jsx'
import { PasswordField } from './PasswordField.jsx'
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import GoogleSSO from './GoogleSSO.js';

function LoginCard({currentUserInfo, setCurrentUserInfo}) {

  const passwordRef = useRef(null);
  // console.log(currentUserInfo); // { current: null }

  // useEffect(() => {
  //   console.log(passwordRef); // <input type="text">...</input>
  //   // inputRef.current.focus(); // 對 AwesomeInput 中的 <input /> 進行操作
  // }, []);

  const [email, setEmail] = useState('');
  const handleEmailChange = (event) => setEmail(event.target.value)
  // const isEmailError = email === ''

  const [password, setPassword] = useState('');
  const handlePasswordChange = (event) => setPassword(event.target.value)
  // const isPasswordError = (password.length < 8 || password.length > 20 || password === password.toLowerCase() || password === password.toUpperCase() || !(/\d/.test(password)))

  // console.log(password);
  const navigate = useNavigate();
  const handleSubmit = async e => {
    e.preventDefault();
    if (true) { // Error handling
      axios.get(`http://52.193.252.15/api/1.0/user?email=${email}&password=${password}`, { crossdomain: true })
          .then(response => {
              console.log(jwt_decode(response.data.message));
              setCurrentUserInfo(jwt_decode(response.data.message));
              localStorage.setItem('user', jwt_decode(response.data.message).name);
              window.alert('Login successfully!');
              navigate('/');
           })
          .catch(error => { window.alert('Login failed!');
          console.log(error);});
    }
  }

  return (
    <Container
      maxW="lg"
      py={{
        base: '12',
        md: '4',
      }}
      px={{
        base: '0',
        sm: '8',
      }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Logo />
          <Stack
            spacing={{
              base: '2',
              md: '3',
            }}
            textAlign="center"
          >
            <Heading
              fontSize={'4xl'} textAlign={'center'}
            >
              Log in to your account
            </Heading>
            <HStack spacing="1" justify="center">
              <Text fontSize={'lg'} color={'gray.600'}>Don't have an account?</Text>
              <Link color={'blue.400'} href={'/signup'}>Sign up</Link>
            </HStack>
          </Stack>
        </Stack>
        <Box
          py={{
            base: '0',
            sm: '8',
          }}
          px={{
            base: '4',
            sm: '10',
          }}
          bg={{
            base: 'white',
            sm: 'bg-surface',
          }}
          boxShadow={{
            base: 'none',
            sm: 'md',
          }}
          borderRadius={{
            base: 'none',
            sm: 'xl',
          }}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input id="email" type="email" value={email} onChange={handleEmailChange} backgroundColor={"white"} />
              </FormControl>
              <PasswordField value={password} onChange={handlePasswordChange} ref={passwordRef}/>
            </Stack>
            <HStack justify="space-between">
              <Checkbox defaultChecked>Remember me</Checkbox>
              <Button variant="link" colorScheme="blue" size="sm">
                Forgot password?
              </Button>
            </HStack>
            <Stack spacing="6" justifyContent={'center'}>
              <Button 
              variant="primary"
              loadingText="Submitting"
              size="lg"
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              onClick={handleSubmit}>Login</Button>
              <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                  or continue with
                </Text>
                <Divider />
              </HStack>
              <Box alignItems="flex-end" width={"100%"} justifyContent="center">
                <OAuthButtonGroup />
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  )
}

export default LoginCard;