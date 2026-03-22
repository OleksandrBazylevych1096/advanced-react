import type {i18n as I18nInstance} from "i18next";
import {createInstance} from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import {initReactI18next} from "react-i18next";

export const supportedLngs = ["en", "de"] as const;
const i18n = createInstance() as I18nInstance;

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: false,
        supportedLngs,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
