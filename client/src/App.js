
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChatRoomViewer from "./components/ChatRoomViewer";
import Signup from "./components/SignUp";
import LanguageSwitcher from "./components/LanguageSwitcher";

function App() {

    const { t } = useTranslation();
    console.log('t: ', t)

    return (
        <div className="App">
            <h1>{t('mernStackChatApp')}</h1>
            <LanguageSwitcher />
            <BrowserRouter>
                <Routes>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/chat/:id" element={<ChatRoomViewer />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

