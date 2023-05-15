import '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import apolloClient from './apolloClient';
import theme from './theme'; // Import your custom MUI theme file

import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import Backend from "i18next-http-backend";

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        lng: "en", fallbackLng: "en", interpolation: {
            escapeValue: false
        }, backend: {
            loadPath: '../public/locales/{{lng}}/translation.json'
        },
    }).then(() => console.log('i18n initialized'));


const root = document.getElementById('root');

if (root) {
    ReactDOM.createRoot(root).render(
        <ThemeProvider theme={theme}>
            <ApolloProvider client={apolloClient}>
                <App />
            </ApolloProvider>
        </ThemeProvider>
    );
} else {
    console.error('Error: Root element not found.');
}
