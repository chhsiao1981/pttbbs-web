import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import zhTW from "./zh-TW.json";

// https://developers.google.com/workspace/admin/directory/v1/languages
const resources = {
  en: {
    translation: en,
  },
  "en-US": {
    translation: en,
  },
  "zh-TW": {
    translation: zhTW,
  },
};

i18n
  // .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "zh-TW",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    debug: true,
  });

export default i18n;
