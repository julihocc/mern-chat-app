
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChatRoomViewer from "./components/ChatRoomViewer";
import Signup from "./components/SignUp";

function App() {
    return (
        <div className="App">
            <h1>MERN Stack Chat App</h1>
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

