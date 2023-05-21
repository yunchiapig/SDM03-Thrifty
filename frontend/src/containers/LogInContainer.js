import {
    Box,
    Img,
    useColorModeValue,
    Spinner
} from '@chakra-ui/react';
import logo from '../Images/logo.png';
import LogInCard from '../components/LogInCard';
import SignUpCard from '../components/SignUpCard';
import LanguageSelector from '../components/LanguageSelector';
import { useLocation} from "react-router-dom";
import { useStoreAdmin } from '../hooks/useStoreAdmin';

export default () => {
    const location = useLocation();
    const {loading} = useStoreAdmin();
    return (
        <Box minH = '100vh' bg={useColorModeValue('gray.100', 'gray.900')} display = 'flex'>
            <Box w = '50%' align = 'center' pl = '10%'>
                { location.pathname == '/login' ?
                <LogInCard /> :
                <SignUpCard />}
            </Box>
            <Box w = '50%' display='flex' flexDirection = 'column' alignItems='center' justifyContent='center' pr = '10%'>
                <Img width='60%' objectFit='contain' src= {logo} alt = "Logo" mb='10'/>
                <LanguageSelector/>
            </Box>
        </Box>
    )
}