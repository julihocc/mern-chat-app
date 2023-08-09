// frontend/src/AuthProvider.js

import React from 'react';
import AuthContext from './AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from './actions';

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    const handleLogin = () => {
        dispatch(loginUser());
    };

    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        dispatch(logoutUser());
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, onLogin: handleLogin, onLogout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
