import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (language) => {
        console.log('Changing language to: ' + language)
        i18n.changeLanguage(language)
            .then(r => console.log('Language changed to: ' + language)) // Success
            .catch(
                err => console.error('Error changing language to: ' + language + ' - ' + err) // Error
            )// ;
    };

    return (
        <div>
            <button onClick={() => changeLanguage('en')}>English</button>
            <button onClick={() => changeLanguage('es')}>Español</button>
            <button onClick={() => changeLanguage('fr')}>Français</button>
            {/* Add more buttons for other languages here */}
        </div>
    );
};

export default LanguageSwitcher;
