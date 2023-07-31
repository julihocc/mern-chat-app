// CST - 2023-07-27 15:30
// path: frontend\src\components\Login.js
import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import {useTranslation} from "react-i18next";
import log from '../utils/logger'; // import the logger

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

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const client = useApolloClient();
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginUser, { error }] = useMutation(LOGIN_USER, {
        onError(err) {
            log.error('Login Error:', err.message); // Replaced console.error with log.error
            alert('Failed to login. Please check your email and password.');
        },
        onCompleted(data) {
            onLogin();

            log.debug('Calling onCompleted(data)'); // Replaced console.log with log.debug
            log.debug('data', data);
            log.debug('data.login.token', data.login.token);
            log.debug('data.login.user', data.login.user.email);
            document.cookie = `token=${data.login.token}; path=/; max-age=3600`;
            log.debug('document.cookie', document.cookie);

            client.query({
                query: GET_CURRENT_USER,
                fetchPolicy: 'network-only',
            }).then(
                ({ data }) => {
                    log.debug('client.query data', data);
                    log.debug('client.query data.getCurrentUser', data.getCurrentUser);
                    log.debug('client.query data.getCurrentUser.id', data.getCurrentUser.id);
                },
                (err) => {
                    log.error('client.query Error:', err.message); // Replaced console.error with log.error
                },
            ).catch(
                (err) => {
                    log.error('client.query Error:', err.message); // Replaced console.error with log.error
                },
            );

            navigate('/dashboard');
        },
    });

    if (error) return <p>LOGIN_USER Error: {error.message}</p>;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email === "" || password === "") {
            alert(t('bothFieldsRequired'));
            return;
        }

        try {
            await loginUser({ variables: { email, password } });
        } catch (err) {
            log.error(err); // Replaced console.error with log.error
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
