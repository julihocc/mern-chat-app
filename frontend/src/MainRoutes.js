// path: frontend\src\MainRoutes.js

import { useSelector, useDispatch } from 'react-redux'; // Import Redux hooks
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import Dashboard from './components/Dashboard';
import ChatRoomViewer from "./components/ChatRoomViewer";
import Signup from "./components/SignUp";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { logoutUser, setUser } from './redux/slices/userSlice'; // Make sure the actions are defined

const MainRoutes = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
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
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              {t("welcome")}
            </Typography>
            <LanguageSwitcher />
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
        </AppBar>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="/login" element={<LoginComponent onLogin={handleLogin} />} />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/chat/:chatRoom" element={<ChatRoomViewer />} />
        </Routes>
      </>
    );
};

export default MainRoutes;
