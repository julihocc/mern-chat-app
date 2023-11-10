// frontend/src/components/Login.js
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useApolloClient} from "@apollo/client";
import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {useNavigate} from "react-router-dom";
import {Alert, Button, TextField, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import logger from "../utils/logger";
import {setUser} from "../redux/slices/userSlice";
import isEmail from "validator/lib/isEmail";

const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            id
        }
    }
`;

const LOGIN_USER = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                id
                email
            }
        }
    }
`;

const Login = () => {
	const navigate = useNavigate();
	const client = useApolloClient();
	const dispatch = useDispatch();
	const {t} = useTranslation();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const [loginUser, {error}] = useMutation(LOGIN_USER, {
		onError(err) {
			logger.error("Login Error:", err.message);
			// navigate("/dashboard");
			setErrorMessage(err.message);
		},
		onCompleted(data) {
			setErrorMessage("");
			logger.debug("Login successful. Setting user in Redux store.");
			dispatch(setUser(data.login.user));
			// TODO: Remove localStorage and use only cookies
			// localStorage.setItem("authToken", data.login.token);
			document.cookie = `token=${data.login.token}; path=/; max-age=3600; SameSite=Lax`;
			logger.debug("document.cookie", document.cookie);

			client
				.query({
					query: GET_CURRENT_USER,
					fetchPolicy: "network-only",
				})
				.then(
					({data}) => {
						logger.debug("client.query data", data);
						logger.debug(
							"client.query data.getCurrentUser",
							data.getCurrentUser,
						);
						logger.debug(
							"client.query data.getCurrentUser.chatRoomId",
							data.getCurrentUser.id,
						);
					},
					(err) => {
						logger.error("client.query Error:", err.message);
					},
				)
				.catch((err) => {
					logger.error("client.query Error:", err.message);
				});

			logger.debug("Navigating to dashboard");
			navigate("/dashboard");
		},
	});

	if (error) return <p>LOGIN_USER Error: {error.message}</p>;

	const handleSubmit = async (e) => {
		e.preventDefault();
		logger.debug("Handling form submit");

		if (!isEmail(email)) {
			setErrorMessage(t("invalidEmail"));
			return;
		}

		if (email === "" || password === "") {
			setErrorMessage(t("bothFieldsRequired"));
			return;
		}

		try {
			logger.debug("Attempting login with email:", email);
			await loginUser({variables: {email, password}});
		} catch (err) {
			logger.error("Login attempt failed:", err);
		}
	};

	return (
		<div>
			<h2>{t("login")}</h2>
			<form onSubmit={handleSubmit}>

				<TextField
					type="email"
					label={t("email")}
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
						setErrorMessage("");
					}}
				/>

				<TextField
					type="password"
					label={t("password")}
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
						setErrorMessage("");
					}}
				/>

				<Button type="submit" variant="contained" color="primary">
					{t("login")}
				</Button>
			</form>
			{errorMessage && (
				<Alert severity="error" style={{ marginTop: '20px' }}>
					Alert? {errorMessage}
				</Alert>
			)}
		</div>
	);
};

export default Login;
