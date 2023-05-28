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
        <Box minH = '100vh' bg={useColorModeValue('gray.100', 'gray.900')} display = 'flex' flexDirection={{lg:'row', base: 'column'}} alignItems={{base: 'center', lg: 'none'}}>
            <Box display={{lg:'none', base: 'flex'}} flexDirection = 'column' alignItems='center' mt = '20px'>
                <Img width='50%' objectFit='contain' src= {logo} alt = "Logo" mb='10'/>
                <LanguageSelector/>
            </Box>
            <Box w = {{lg: '50%', base: "100%"}} align = 'center' position='relative' p = '20px'>
                { location.pathname == '/login' ?
                <LogInCard /> :
                <SignUpCard />}
            </Box>
            <Box w = '50%' display={{lg:'flex', base: 'none'}} flexDirection = 'column' alignItems='center' justifyContent='center' pr = '10%'>
                <Img width='60%' objectFit='contain' src= {logo} alt = "Logo" mb='10'/>
                <LanguageSelector/>
            </Box>
        </Box>
    )
}