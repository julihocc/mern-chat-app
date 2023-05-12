import '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import apolloClient from './apolloClient';
import theme from './theme'; // Import your custom MUI theme file

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
