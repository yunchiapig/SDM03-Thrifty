import { Box, Spinner } from "@chakra-ui/react"

export default () => {
    return (
        <Box
        zIndex='9999'
        w = 'full'
        h = 'full'
        position='fixed'
        fisplay='flex'
        display='flex'
        justifyContent='center'   
        alignItems='center'       
        >
        <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
        />
        </Box>
    )
}