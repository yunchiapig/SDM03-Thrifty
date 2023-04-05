import './App.css';
import { Box, VStack, useColorModeValue, Flex } from '@chakra-ui/react';
// import Card from "./Components/ShopInfoCard";
import NavBar from './Components/NavBar';
import React, { useEffect, useState } from "react";
import HomePage from './Containers/HomePage';
import SimpleSidebar from './Components/SideBar';
import StorePage from './Containers/StorePage';

function App() {
  // const [fixedBar, setFixedBar] = useState(false);
  // const [navbarHeight, setNavbarHeight] = useState(0);

  // useEffect(()=>{
  //   window.onscroll = ()=>myFunction();
  //   var header = document.getElementById("classes-bar");
  //   var sticky = header.offsetTop;
  //   console.log("sticky", sticky)
  //   var navbar = document.getElementById('navbar');
  //   var navbarBottom = navbar.offsetHeight;
  //   console.log("navbarBottom", navbarBottom)

  //   function myFunction() {
  //     // window.pageYOffset
  //     if (window.pageYOffset > (navbarBottom-sticky)) {
  //       header.classList.add("sticky");
  //       // header.setAttribute("top", `${navbarBottom}`);
  //       // setFixedBar(true);
  //       setNavbarHeight(navbarBottom);
  //     } else {
  //       header.classList.remove("sticky");
  //       // header.removeAttribute("top");
  //       setNavbarHeight('auto');

  //       // setFixedBar(false);
  //     }
  //   }
  // })

  return (
    <VStack >
      <Box w="100%" bg={useColorModeValue('gray.100', 'gray.900')}minH="100vh">
        <NavBar zIndex={100}/>
        {/* <SimpleSidebar/> */}
        <Box w="100%" h="19vh"/>
        
        <HomePage/>
        {/* <Box className="bar" id="classes-bar" zIndex={100} background={"#000000"}
          top={`${navbarHeight}`}>BAR</Box> */}
        <StorePage/>
      </Box>
      
      {/* <Card/>
      <ProductAddToCart/> */}
    </VStack>
  );
}

export default App;
