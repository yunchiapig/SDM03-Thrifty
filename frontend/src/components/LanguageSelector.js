import React from "react";
import { Box, Select } from '@chakra-ui/react';
import { useTranslation } from "react-i18next";

function LanguageSelector() {

  const { i18n } = useTranslation();

  return (
    <Box w="130px">
        <Select
        cursor='pointer'
        borderColor='blue'
        value={i18n.language}
        onChange={(e) =>
            i18n.changeLanguage(e.target.value)
        }
        >
            <option value="zh">繁體中文</option>
            <option value="en">English</option>
        </Select>
    </Box>
  );
}

export default LanguageSelector;