import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json'
import zh from './zh.json'

i18next.use(initReactI18next).init({
  lng: 'en', // 預設語言
  resources: {
    en: {
      translation: en
    },
    zh: {
      translation: zh
    }
  }
});
