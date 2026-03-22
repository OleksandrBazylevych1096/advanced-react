import {createInstance} from "i18next";
import type {i18n as I18nInstance} from "i18next";
import {initReactI18next} from "react-i18next";

const i18nForTests = createInstance() as I18nInstance;
i18nForTests.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    debug: false,
    interpolation: {
        escapeValue: false,
    },
    resources: {en: {translationNS: {}}},
});

export default i18nForTests;
