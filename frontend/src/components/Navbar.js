import React, { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  calc,
  Img
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiServer,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi';
import logo from '../Images/logo.png';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import {useStoreAdmin} from "../hooks/useStoreAdmin";
import NavItem from './NavItem';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';


interface LinkItemProps {
  name: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'nav.profile', icon: FiHome, ref: "/Profile" },
    { name: 'nav.productManagement', icon: FiServer, ref: "/ProductManagement"},
    { name: 'nav.setting', icon: FiSettings, ref: "/Settings" },
  ];

export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box h = '100%' overflow='scroll' bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} minH = '100vh' p="4"> 
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const {setTitle} = useStoreAdmin();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const HandleNav = (t) => {
        navigate('/mainpage' + t.ref);
        //setTitle(t)
        onClose();
    }
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <CloseButton position = 'absolute' top = {5} right = {5} display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      <Flex alignItems="center" mt = {4} mb={8} ml="6" mr="10" justifyContent="center" >
        <Img w={{base: '55%', md: '75%'}} pt={10} src= {logo} alt = "Logo"/>
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} name = {link.name} onClick = {() => HandleNav(link)}>
          {t(link.name)}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}


interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const {storeInfo, setStoreInfo} = useStoreAdmin();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const HandleLogOut = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("signup");
    localStorage.removeItem("jwt");
    setStoreInfo(null);
    navigate('/login')
  }
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      width = {{ base: 'full', md: 'calc(100% - 240px)'}}
      alignItems="center"
      pos='fixed'
      zIndex = '1'
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        Logo
      </Text>

      <HStack spacing={{ base: '2', md: '8' }}>
        <Box display={{base: 'none', md: 'flex'}}>
          <LanguageSelector/>
        </Box>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <VStack
                  display= 'flex'
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{storeInfo.name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display='flex'>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem onClick = {HandleLogOut}>{t("nav.signout")}</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};