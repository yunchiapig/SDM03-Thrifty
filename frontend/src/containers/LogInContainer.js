import {
    Box,
    Img,
    useColorModeValue,
} from '@chakra-ui/react';
import logo from '../Images/logo.png';
import LogInCard from '../components/LogInCard';
import SignUpCard from '../components/SignUpCard';
import { useLocation} from "react-router-dom";

export default () => {
    const location = useLocation();
    return (
        <Box minH = '100vh' bg={useColorModeValue('gray.100', 'gray.900')} display = 'flex'>
            <Box w = '50%' align = 'center' pl = '10%'>
                { location.pathname == '/login' ?
                <LogInCard /> :
                <SignUpCard />}
            </Box>
            <Box w = '50%' display='flex' justifyContent='center' pr = '10%'>
                <Img boxSize='60%' objectFit='contain' mt = '20%' src= {logo} alt = "Logo"/>
            </Box>
        </Box>
    )
}