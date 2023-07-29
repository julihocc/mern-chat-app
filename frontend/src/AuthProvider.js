import { useState, useEffect } from 'react';
import AuthContext from './AuthContext';  // Assume AuthContext is in the same directory

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check the cookie for login status when the component mounts
        setIsLoggedIn(document.cookie.includes('Bearer'));
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        // Erase the cookie and set isLoggedIn to false
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, onLogin: handleLogin, onLogout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
