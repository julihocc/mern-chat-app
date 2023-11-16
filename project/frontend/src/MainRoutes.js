// path: frontend\src\MainRoutes.js

import React from 'react';
import {ApolloProvider} from '@apollo/client';
import {contactServiceApolloClient, authServiceApolloClient, chatServiceApolloClient} from './apolloClient';
import {useDispatch, useSelector} from "react-redux"; // Import Redux hooks
import {Link, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
	AppBar,
	Button,
	Container,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Toolbar,
	Typography,
} from "@mui/material";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ChatRoomViewer from "./components/ChatRoomViewer";
import Signup from "./components/SignUp";
import LanguageSwitcher from "./components/LanguageSwitcher";
import {logoutUser, setUser} from "./redux/slices/userSlice";
import Settings from "./components/Settings";
import {useState} from "react";
import MenuIcon from "@mui/icons-material/Menu";
import {LOGOUT_MUTATION} from './gql/mutations/LOGOUT_MUTATION';
import {useMutation} from "@apollo/client";
import Logout from "./components/Logout";

const MainRoutes = () => {

	// const [logoutMutation] = useMutation(LOGOUT_MUTATION)
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {t} = useTranslation();
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn); // Assuming `isLoggedIn` is in the user part of the state
	const [drawerOpen, setDrawerOpen] = useState(false);


	// const handleLogout = () => {
	// 	document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	// 	dispatch(logoutUser()); // Dispatch logout action
	// 	navigate("/login");
	// };



	const handleLogin = (userData) => {
		dispatch(setUser(userData)); // Dispatch login action with user data
	};

	const handleLogout = () => {
		navigate("/logout");
	};

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};

	return (
		<>
			<Container>
				<AppBar position="static">
					<Toolbar>
						<IconButton edge="start" color="inherit" onClick={toggleDrawer}>
							<MenuIcon/>
						</IconButton>
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
				</AppBar>
				<Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
					<List>
						<ListItem button component={Link} to="/dashboard">
							<ListItemText primary="Dashboard"/>
						</ListItem>
					</List>
				</Drawer>
			</Container>

			<Container style={{paddingTop: "64px"}}>
				<Routes>
					<Route
						path="/"
						element={
							isLoggedIn ? (
								<ApolloProvider client={contactServiceApolloClient}>
									<Dashboard onLogout={handleLogout}/>
								</ApolloProvider>
							) : (
								<Navigate to="/" replace/>
							)
						}
					/>
					<Route
						path="/signup"
						element={
							<ApolloProvider client={authServiceApolloClient}>
								<Signup onLogin={handleLogin}/>
							</ApolloProvider>
						}
					/>
					<Route
						path="/login"
						element={
							<ApolloProvider client={authServiceApolloClient}>
								<Login onLogin={handleLogin}/>
							</ApolloProvider>
						}
					/>
					<Route
						path="/dashboard"
						element={
							isLoggedIn ? (
								<ApolloProvider client={contactServiceApolloClient}>
									<Dashboard onLogout={handleLogout}/>
								</ApolloProvider>
							) : (
								<Navigate to="/" replace/>
							)
						}
					/>
					<Route
						path="/chat/:chatRoomId"
						element={
							<ApolloProvider client={chatServiceApolloClient}>
								<ChatRoomViewer/>
							</ApolloProvider>
						}
					/>
					<Route
						path="/settings"
						element={
							<ApolloProvider client={authServiceApolloClient}>
								<Settings/>
							</ApolloProvider>
						}
					/>
					<Route path="/logout" element={
						<ApolloProvider client={authServiceApolloClient}>
                            <Logout/>
                        </ApolloProvider>
					} /> {/* New route for logout */}

				</Routes>
			</Container>
		</>
	);
};

export default MainRoutes;
