import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import './index.css';
import apolloClient  from "./apolloClient";

const root = document.getElementById('root');

if (root) {
    ReactDOM.createRoot(root).render(
        <ApolloProvider client={apolloClient}>
            <App />
        </ApolloProvider>
    );
} else {
    console.error('Error: Root element not found.');
}
