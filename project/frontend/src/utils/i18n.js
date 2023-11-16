// frontend/src/i18n.js
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {fetchTranslations} from "./translationService";
import logger from "./logger";

const resources = await fetchTranslations();

const browserLanguage = window.navigator.language || window.navigator.userLanguage;
logger.debug(`Browser language: ${browserLanguage}`);

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources, lng: browserLanguage, fallbackLng: "en", interpolation: {
			escapeValue: false,
		}, detection: {
			order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag", "path", "subdomain",],

			lookupQuerystring: "lng",
			lookupCookie: "i18next",
			lookupLocalStorage: "i18nextLng",
			lookupFromPathIndex: 0,
			lookupFromSubdomainIndex: 0,

			caches: ["localStorage", "cookie"],
			excludeCacheFor: ["cimode"],

			checkWhitelist: true,
		},
	})
	.then((t) => {
		return t;
	})
	.catch((error) => {
		logger.error(error);
	});

export default i18n;
