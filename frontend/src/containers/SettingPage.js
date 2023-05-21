import 
{ Box,
  FormControl,
  FormLabel
 } from "@chakra-ui/react"

import LanguageSelector from "../components/LanguageSelector"
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation();
    return (
        <Box h='100%' w = '100%' p = '10'>
            <FormControl id="name">
                <FormLabel>{t('setting.language')}</FormLabel>
                <LanguageSelector/>
            </FormControl>
        </Box>
    )
}