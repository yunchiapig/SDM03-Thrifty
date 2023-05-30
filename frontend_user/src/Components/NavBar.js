import { Box, Flex, Text, IconButton, Button, Stack, Collapse, Icon, Link,
    Popover, PopoverTrigger, PopoverContent, useColorModeValue, useDisclosure, Square, background} from '@chakra-ui/react';
import {HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon} from '@chakra-ui/icons';
import Logo from '../images/logo.png';
import { Input } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Filter from './Filter';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

export default function NavBar({filterOptions, filteredValues, setFilteredValues, onHomePage}) {
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const { t, i18n } = useTranslation();
  // var posDefault = -99;
  // if (i18n.language =='en') {posDefault = -145}
  // const [notificationPos, setNotificationPos] = useState(posDefault);

  const handleLogOut = () => {
    localStorage.clear();
    navigate('/');
  }

  return (
    <Box w="100%" zIndex={100} bg={useColorModeValue('gray.100', 'gray.900')} px={4} position="fixed" id="navbar">
      <Flex
        bg={useColorModeValue('white', 'gray.800')} 
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'none', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={'start' }>
          <Box maxW='20vh' onClick={()=>{ navigate(`/`);}} >
            <img className="logo" src={Logo} alt="Thrifty" style={{cursor:'pointer', maxHeight:'10vw'}} />
          </Box>
          <Flex  ml={10} w="100%">
            {window.screen.width >= 821 ?
              <Square w="10vw"/>:<></>}
            <Square>
              {onHomePage?
                <Filter filterOptions={filterOptions} 
                  filteredValues={filteredValues} setFilteredValues={setFilteredValues}/>
                :<></>
              }
            </Square>
          </Flex>
        </Flex>

        {(localStorage.getItem('name') !== null) ? 
        (<Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          <LanguageSelector />
          <Button
            as={'a'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'/myfav'}>
            {t('Hi')} {localStorage.getItem('name')} {t('exclamation')}
          </Button>
          <Button
            as={'a'}
            display={{ base: 'inline-flex', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'pink.400'}
            href={'/'}
            _hover={{
              bg: 'pink.300',
            }}
            onClick={handleLogOut}>
            {t('logout')}
          </Button>
          </Stack>
          ) : (
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          <LanguageSelector />
          <Button
            as={'a'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'/login'}>
            {t('login')}
          </Button>
          <Button
            as={'a'}
            display={{ base: 'inline-flex', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'pink.400'}
            href={'/signup'}
            _hover={{
              bg: 'pink.300',
            }}>
            {t('signup')}
          </Button>
        </Stack>)
        }
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}
  
  const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  
    return (
      <Stack direction={'row'} spacing={4} >
        {NAV_ITEMS.map((navItem) => (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Link
                  p={2}
                  href={navItem.href ?? '#'}
                  fontSize={'sm'}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor,
                  }}>
                  {navItem.label}
                </Link>
              </PopoverTrigger>
  
              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={'xl'}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}>
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        ))}
      </Stack>
    );
  };
  
  const DesktopSubNav = ({ label, href, subLabel }) => {
    return (
      <Link
        href={href}
        role={'group'}
        display={'block'}
        p={2}
        rounded={'md'}
        _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
        <Stack direction={'row'} align={'center'}>
          <Box>
            <Text
              transition={'all .3s ease'}
              _groupHover={{ color: 'pink.400' }}
              fontWeight={500}>
              {label}
            </Text>
            <Text fontSize={'sm'}>{subLabel}</Text>
          </Box>
          <Flex
            transition={'all .3s ease'}
            transform={'translateX(-10px)'}
            opacity={0}
            _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
            justify={'flex-end'}
            align={'center'}
            flex={1}>
            <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
          </Flex>
        </Stack>
      </Link>
    );
  };
  
  const MobileNav = () => {
    return (
      <Stack
        bg={useColorModeValue('white', 'gray.800')}
        p={4}
        display={{ md: 'none' }}>
        {NAV_ITEMS.map((navItem) => (
          <MobileNavItem key={navItem.label} {...navItem} />
        ))}
      </Stack>
    );
  };
  
  const MobileNavItem = ({ label, children, href }) => {
    const { isOpen, onToggle } = useDisclosure();
  
    return (
      <Stack spacing={4} onClick={children && onToggle}>
        <Flex
          py={2}
          as={Link}
          href={href ?? '#'}
          justify={'space-between'}
          align={'center'}
          _hover={{
            textDecoration: 'none',
          }}>
          <Text
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}>
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={'all .25s ease-in-out'}
              transform={isOpen ? 'rotate(180deg)' : ''}
              w={6}
              h={6}
            />
          )}
        </Flex>
  
        <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
          <Stack
            mt={2}
            pl={4}
            borderLeft={1}
            borderStyle={'solid'}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            align={'start'}>
            {children &&
              children.map((child) => (
                <Link key={child.label} py={2} href={child.href}>
                  {child.label}
                </Link>
              ))}
          </Stack>
        </Collapse>
      </Stack>
    );
  };
  
  // interface NavItem {
  //   label: string;
  //   subLabel?: string;
  //   children?: Array<NavItem>;
  //   href?: string;
  // }
  
  const NAV_ITEMS = [
    {
      label: 'Inspiration',
      children: [
        {
          label: 'Explore Design Work',
          subLabel: 'Trending Design to inspire you',
          href: '#',
        },
        {
          label: 'New & Noteworthy',
          subLabel: 'Up-and-coming Designers',
          href: '#',
        },
      ],
    },
    {
      label: 'Find Work',
      children: [
        {
          label: 'Job Board',
          subLabel: 'Find your dream design job',
          href: '#',
        },
        {
          label: 'Freelance Projects',
          subLabel: 'An exclusive list for contract work',
          href: '#',
        },
      ],
    },
    {
      label: 'Learn Design',
      href: '#',
    },
    {
      label: 'Hire Designers',
      href: '#',
    },
  ];