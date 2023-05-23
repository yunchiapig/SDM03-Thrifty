import React from "react";
import { Box, Select } from '@chakra-ui/react';
import { useTranslation } from "react-i18next";

function LanguageSelector() {

  const { i18n } = useTranslation();

  return (
    <Box w="130px">
        <Select
        value={i18n.language}
        onChange={(e) =>
            i18n.changeLanguage(e.target.value)
        }
        >
            <option value="zh-TW">繁體中文</option>
            <option value="en">English</option>
        </Select>
    </Box>
  );
}

export default LanguageSelector;