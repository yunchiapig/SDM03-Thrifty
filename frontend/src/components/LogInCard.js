import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export default function SimpleCard() {
  return (
    
    <Box
      rounded={'lg'}
      w = '65%'
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow={'lg'}
      p={8}>
      <Stack spacing={6}>
        <FormControl id="email">
          <FormLabel>Account</FormLabel>
          <Input type="email" />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </FormControl>
        <Stack spacing={4}>
          {/*<Stack
            direction={{ base: 'column', sm: 'row' }}
            align={'start'}
            justify={'space-between'}>
            <Checkbox>Remember me</Checkbox>
            <Link color='#4FA060'>Forgot password?</Link>
  </Stack>*/}
          <Button
            bg= '#4FA060'
            color={'white'}
            _hover={{
              bg: '#64CCC9',
            }}>
            Sign in
          </Button>
          <Button
            bg= '#C4848F'
            color={'white'}
            _hover={{
              bg: '#E5BCD7',
            }}>
            New account
          </Button>
        </Stack>
      </Stack>
    </Box>
     
  );
}