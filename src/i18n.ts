import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import np from "./locales/np.json";
import bn from "./locales/bn.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import hi from "./locales/hi.json";

const resources = {
  en: { translation: en },
  np: { translation: np },
  bn: { translation: bn },
  es: { translation: es },
  fr: { translation: fr },
  hi: { translation: hi },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "np", "bn", "es", "fr", "hi"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "care2care_lang",
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
