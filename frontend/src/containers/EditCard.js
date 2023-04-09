import React, { ReactNode, useState } from 'react';
import { useLocation} from "react-router-dom";
import './SubPage.css';
import Navbar from '../components/Navbar';
import ProductManagementPage from './ProductManagementPage';
import EditCard from './EditCard';
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
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Divider
} from '@chakra-ui/react';

export default () => {
    return (
        <Card ml={{ base: 4, md: 265 }} mr={{ base: 4, md: 10 }} mt ={{ base: -2, md: -2 }} display = 'flex' direction= 'flex-start' h='94vh'>
          <Stack divider={<StackDivider />} h = '100%' w = '100%'>
            <Box h = '9%' display="flex" alignItems="center">
              <Flex
                  align="center"
                  p="4"
                  mx="4"
                  borderRadius="lg"
                  role="group"
                >
                  {location?.state?.icon && (
                  <Icon
                      mr="4"
                      fontSize="22"
                      as={location?.state?.icon}
                  />
                  )}
                  <Text fontSize={22}>
                    {location?.state?.name}
                  </Text>
              </Flex>
            </ Box>
            { location?.state?.name === "商品管理" ? 
              <ProductManagementPage /> : 
              null}
          </Stack>
        </Card>
    )
}