// The component is referenced from https://chakra-templates.dev/navigation/sidebar

//import React, { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Image
} from '@chakra-ui/react';
import {
  FiHome,
  FiSettings,
  FiMenu,
  FiServer,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import NavItem from './NavItem';
import {useStoreAdmin} from "../hooks/useStoreAdmin";

interface LinkItemProps {
  name: string;
  icon: IconType;
}


const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome },
  { name: '商品管理', icon: FiServer},
  /*{ name: 'Trending', icon: FiTrendingUp },
  { name: 'Explore', icon: FiCompass },
  { name: 'Favourites', icon: FiStar },*/
  { name: '設定', icon: FiSettings },
];


export default function SidebarWithHeader({
  children
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <>
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
          <SidebarContent onClose={onClose}/>
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen}/>
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const {setTitle} = useStoreAdmin();
  const navigate = useNavigate();
  const HandleNav = (t) => {
    if (t.name === "商品管理"){
      navigate("/ItemManagement");
    } 
    setTitle(t)
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
      <Flex alignItems="center" mt = {4} mb={6} ml="6" mr="10" justifyContent="center" >
        {/*<Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Thrifty
      </Text>*/}
        <Image w='75%'
        src='https://trello.com/1/cards/641c57976a0fdbb331180663/attachments/641c57d28051eb5a5fefea4b/previews/641c57d38051eb5a5fefea9f/download/logo-no-background.png' />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} name = {link.name} icon={link.icon} onClick = {() => HandleNav(link)}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

/*interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};*/

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, title, ...rest }: MobileProps) => {
  return (
    <Flex
      display={{base: 'flex', md: 'none'}}
      ml={{ base: 0, md: 60 }}
      px={{ base: 10}}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'flext-start'}}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      {/*<Text
        display={{ base: 'center'}}
        ml = {{sm: 6, md: 0}}
        fontSize="2xl"
        fontWeight="normal">
        {title}
      </Text>

      
      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">Justina Clark</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
                </Flex>
      </HStack>*/}
    </Flex>
  );
};