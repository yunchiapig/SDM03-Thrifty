import './App.css';
import { Box, VStack, useColorModeValue } from '@chakra-ui/react';
// import Card from "./Components/ShopInfoCard";
// import ProductAddToCart from './Components/Card';
import WithSubnavigation from './Components/NavBar';

function App() {
  return (
    <VStack >
      <Box w="100%" bg={useColorModeValue('gray.100', 'gray.900')}>
        <WithSubnavigation/>
        <Box p={5}>
          Main content here.
        </Box>
      </Box>
      
      {/* <Card/>
      <ProductAddToCart/> */}
    </VStack>
  );
}

export default App;
