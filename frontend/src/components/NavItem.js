import React, { ReactNode, useState } from 'react';
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
} from '@chakra-ui/react';
import {
FiHome,
FiTrendingUp,
FiCompass,
FiStar,
FiSettings,
FiMenu,
FiBell,
FiChevronDown,
FiServer,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import {useStoreAdmin} from "../hooks/useStoreAdmin";


interface NavItemProps extends FlexProps {
    icon: IconType;
    children: ReactText;
}
export default ({ icon, name, children, ...rest }: NavItemProps) => {
    const {title} = useStoreAdmin();
    return (
        <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{
              bg: 'cadetblue',
              color: 'white',
            }}
            my = {1}
            bg = {name === title.name ? 'cadetblue': 'white'}
            color = {name === title.name ? 'white': 'black'}
            {...rest}>
            {icon && (
            <Icon
                mr="4"
                fontSize="16"
                as={icon}
            />
            )}
            {children}
        </Flex>
    );
};