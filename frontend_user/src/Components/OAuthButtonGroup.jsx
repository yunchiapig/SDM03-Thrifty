import { Button, ButtonGroup, VisuallyHidden } from '@chakra-ui/react'
import { GitHubIcon, GoogleIcon, TwitterIcon } from './ProviderIcons'
import GoogleSSO from './GoogleSSO'
const provider = 
  {
    name: 'Google',
    // icon: <GoogleIcon boxSize="5" />,
    icon: <GoogleSSO/>
  }

export const OAuthButtonGroup = () => (
    <Button key={provider.name} width="full" bgColor={'white'}>
      <VisuallyHidden>Sign in with {provider.name}</VisuallyHidden>
      {provider.icon}
    </Button>
)
