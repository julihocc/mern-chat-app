// frontend/src/AuthContext.js

import React from 'react';

// Creating a new context with default values
const AuthContext = React.createContext({
    isLoggedIn: false, // Default value indicating the user is not logged in
    onLogin: () => {}, // Default empty function for handling login
    onLogout: () => {}, // Default empty function for handling logout
});

export default AuthContext; // Exporting the context for use elsewhere in the application
