import React from 'react';
import { useTranslation } from 'react-i18next';
import logger from "../utils/logger";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const changeLanguage = (language) => {
        //logger.debug('Changing language to: ' + language)
        i18n.changeLanguage(language)
            .then(
                () => {
                    //logger.debug('Language changed to: ' + language)
                    }) // Success
            .catch(
                err => logger.error('Error changing language to: ' + language + ' - ' + err) // Error
            )// ;
    };

    return (
        <div>
            <button onClick={() => changeLanguage('en')}>English</button>
            <button onClick={() => changeLanguage('es')}>Español</button>
            <button onClick={() => changeLanguage('fr')}>Français</button>
        </div>
    );
};

export default LanguageSwitcher;
