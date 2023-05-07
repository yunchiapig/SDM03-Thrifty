import {
    Box,
    Img,
    useColorModeValue,
} from '@chakra-ui/react';
import logo from '../Images/logo.png';
import LogInCard from '../components/LogInCard'

export default () => {
    return (
        <Box minH = '100vh' bg={useColorModeValue('gray.100', 'gray.900')} display = 'flex'>
            <Box w = '50%' align = 'center' pt = '30vh' pl = '10%'>
                <LogInCard />
            </Box>
            <Box w = '50%' display='flex' justifyContent='center' pr = '10%'>
                <Img boxSize='60%' objectFit='contain' mt = '20%' src= {logo} alt = "Logo"/>
            </Box>
        </Box>
    )
}