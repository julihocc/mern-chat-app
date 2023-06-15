// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            greeting: 'Hello!',
            // other translation keys...
        },
    },
    fr: {
        translation: {
            greeting: 'Bonjour!',
            // other translation keys...
        },
    },
    // other supported languages...
    es: {
        translation: {
            greeting: '¡Hola!',
        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en', // set the default language
    fallbackLng: 'en', // use English if a translation is missing
    interpolation: {
        escapeValue: false, // react already escapes values by default
    },
});

export default i18n;
