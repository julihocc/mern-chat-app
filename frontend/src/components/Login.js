// frontend/src/components/Login.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch to dispatch Redux actions
import { useApolloClient } from '@apollo/client';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import logger from '../utils/logger'; // Import the logger
import { setUser } from '../redux/slices/userSlice'; // Import the setUser action from the userSlice

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
    const dispatch = useDispatch(); // Use Redux dispatch
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginUser, { error }] = useMutation(LOGIN_USER, {
        onError(err) {
            logger.error('Login Error:', err.message);
            navigate("/dashboard");    
        },
        onCompleted(data) {
          logger.debug("Login successful. Setting user in Redux store.");
          dispatch(setUser(data.login.user)); // Dispatching setUser action

          // Storing the token in local storage
          localStorage.setItem("authToken", data.login.token); // Change made here

          // Setting cookie with SameSite attribute
          document.cookie = `token=${data.login.token}; path=/; max-age=3600; SameSite=Lax`;
          logger.debug("document.cookie", document.cookie);

          // Querying current user
          client
            .query({
              query: GET_CURRENT_USER,
              fetchPolicy: "network-only",
            })
            .then(
              ({ data }) => {
                logger.debug("client.query data", data);
                logger.debug(
                  "client.query data.getCurrentUser",
                  data.getCurrentUser
                );
                logger.debug(
                  "client.query data.getCurrentUser.chatRoomId",
                  data.getCurrentUser.id
                );
              },
              (err) => {
                logger.error("client.query Error:", err.message); // Logging query error
              }
            )
            .catch((err) => {
              logger.error("client.query Error:", err.message); // Logging catch block error
            });

          // Navigating to dashboard
          logger.debug("Navigating to dashboard");
          navigate("/dashboard");
        },
    });

    if (error) return <p>LOGIN_USER Error: {error.message}</p>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        logger.debug('Handling form submit'); // Logging form submit

        if (email === "" || password === "") {
            logger.error(t('bothFieldsRequired'));
            return;
        }

        try {
            logger.debug('Attempting login with email:', email); // Logging login attempt
            await loginUser({ variables: { email, password } });
        } catch (err) {
            logger.error('Login attempt failed:', err); // Logging error on login attempt
        }
    };

    return (
        <div>
            <h2>{t('login')}</h2>
            <form onSubmit={handleSubmit}>
                <TextField
                    type="email"
                    label={t('email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    type="password"
                    label={t('password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                    {t('login')}
                </Button>
            </form>
        </div>
    );
};

export default Login;
