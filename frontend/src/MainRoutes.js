// path: frontend\src\MainRoutes.js

import {useDispatch, useSelector} from 'react-redux'; // Import Redux hooks
import {Link, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {AppBar, Button, Container, Toolbar, Typography} from '@mui/material';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChatRoomViewer from "./components/ChatRoomViewer";
import Signup from "./components/SignUp";
import LanguageSwitcher from "./components/LanguageSwitcher";
import {logoutUser, setUser} from './redux/slices/userSlice';
import Settings from "./components/Settings";

const MainRoutes = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const isLoggedIn = useSelector(state => state.user.isLoggedIn); // Assuming `isLoggedIn` is in the user part of the state

    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        dispatch(logoutUser()); // Dispatch logout action
        navigate('/login');
    };

    const handleLogin = (userData) => {
        dispatch(setUser(userData)); // Dispatch login action with user data
    };

    return (
        <>
            <Container> <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow: 1}}>
                        {t("welcome")}
                    </Typography>
                    <LanguageSwitcher/>
                    {isLoggedIn ? (
                        <>
                            <Button color="inherit" onClick={handleLogout}>
                                {t("logout")}
                            </Button>
                            <Button color="inherit" component={Link} to="/dashboard">
                                {t("dashboard")}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                {t("login")}
                            </Button>
                            <Button color="inherit" component={Link} to="/signup">
                                {t("signup")}
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar> </Container>

            <Container style={{paddingTop: '64px'}}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            isLoggedIn ? (
                                <Dashboard onLogout={handleLogout}/>
                            ) : (
                                <Navigate to="/" replace/>
                            )
                        }
                    />
                    <Route path="/signup" element={<Signup onLogin={handleLogin}/>}/>
                    <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
                    <Route
                        path="/dashboard"
                        element={
                            isLoggedIn ? (
                                <Dashboard onLogout={handleLogout}/>
                            ) : (
                                <Navigate to="/" replace/>
                            )
                        }
                    />
                    <Route path="/chat/:chatRoomId" element={<ChatRoomViewer/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                </Routes>
            </Container>
        </>
    );
};

export default MainRoutes;
