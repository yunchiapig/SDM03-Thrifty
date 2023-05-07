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
import { Logo } from '../Components/Logo.jsx'
import { OAuthButtonGroup } from '../Components/OAuthButtonGroup.jsx'
import { PasswordField } from '../Components/PasswordField.jsx'
import { withRouter } from "../Hooks/withRouter.js";

const LoginPage = () => (
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
              <Input id="email" type="email" backgroundColor={"white"} />
            </FormControl>
            <PasswordField />
          </Stack>
          <HStack justify="space-between">
            <Checkbox defaultChecked>Remember me</Checkbox>
            <Button variant="link" colorScheme="blue" size="sm">
              Forgot password?
            </Button>
          </HStack>
          <Stack spacing="6">
            <Button 
            variant="primary"
            loadingText="Submitting"
            size="lg"
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}>Sign in</Button>
            <HStack>
              <Divider />
              <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                or continue with
              </Text>
              <Divider />
            </HStack>
            <OAuthButtonGroup />
          </Stack>
        </Stack>
      </Box>
    </Stack>
  </Container>
)

export default withRouter(LoginPage)