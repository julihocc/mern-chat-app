// frontend\src\components\Login.js
import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material'; // Import MUI components

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

// const Login = () => {
const Login = ({ onLogin }) => {  // Pass setIsLoggedIn prop

    const navigate = useNavigate();
    const client = useApolloClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginUser, { error }] = useMutation(LOGIN_USER, {

        onError(err) {
            // Handle error by showing a more user-friendly message
            console.error('Login Error:', err.message);
            alert('Failed to login. Please check your email and password.');
        },

        onCompleted(data) {

            // Set isLoggedIn to true on successful login
            // setIsLoggedIn(true);
            onLogin();

            console.log('Calling onCompleted(data)');
            console.log('data', data);
            // Set JWT token as a cookie
            console.log('data.login.token', data.login.token);
            console.log('data.login.user', data.login.user.email);
            document.cookie = `token=${data.login.token}; path=/; max-age=3600`;
            console.log('document.cookie', document.cookie);

            // Refetch the GET_CURRENT_USER query after login
            client.query({
                query: GET_CURRENT_USER,
                fetchPolicy: 'network-only', // ignore cache
            });

            // Navigate to the dashboard
            navigate('/dashboard');
        },
    });

    if (error) return <p>LOGIN_USER Error: {error.message}</p>;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email === "" || password === "") {
            alert("Both fields are required!");
            return;
        }


        try {
            await loginUser({ variables: { email, password } });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <TextField
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                    Login
                </Button>
            </form>
        </div>
    );
};

export default Login;
