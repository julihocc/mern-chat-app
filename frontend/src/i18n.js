// frontend/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { fetchTranslations } from './components/translationService';
//
// const resources = {
//     en: {
//         translation: {
//             greeting: 'Hello!',
//             farewell: 'Goodbye!',
//             welcome: 'Welcome to our application!',
//             // other translation keys...
//         },
//     },
//     fr: {
//         translation: {
//             greeting: 'Bonjour!',
//             farewell: 'Au revoir!',
//             welcome: 'Bienvenue dans notre application!',
//             // other translation keys...
//         },
//     },
//     es: {
//         translation: {
//             greeting: '¡Hola!',
//             farewell: '¡Adiós!',
//             welcome: '¡Bienvenido a nuestra aplicación!',
//         }
//     }
// };

const resources = await fetchTranslations();
console.log(resources)

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en', // use English if a translation is missing
        interpolation: {
            escapeValue: false, // react already escapes values by default
        },
        detection: {
            // order and from where user language should be detected
            order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

            // keys or params to lookup language from
            lookupQuerystring: 'lng',
            lookupCookie: 'i18next',
            lookupLocalStorage: 'i18nextLng',
            lookupFromPathIndex: 0,
            lookupFromSubdomainIndex: 0,

            // cache user language on
            caches: ['localStorage', 'cookie'],
            excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

            // only detect languages that are in the whitelist
            checkWhitelist: true,
        },
    });

export default i18n;
