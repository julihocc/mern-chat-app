// Signup component
// Path: frontend\src\components\SignUp.js
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material'; // Import MUI components

const SIGNUP = gql`
    mutation SignUp($username: String!, $email: String!, $password: String!) {
        signUp(username: $username, email: $email, password: $password) {
            token
            user {
                id
                username
                email
            }
        }
    }
`;

const Signup = ({ onLogin }) => { // Pass setIsLoggedIn as a prop
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Add confirm password state

    const [signUp, { error }] = useMutation(SIGNUP, {
        onError(err) {
            console.error('Signup Error:', err.message);
            alert('Failed to signup. Please check your inputs.');
        },
        onCompleted(data) {
            document.cookie = `token=${data.signUp.token}; path=/; max-age=3600`;
            // setIsLoggedIn(true); // Update the user state
            onLogin(); // Call onLogin() to update the user state
            navigate('/dashboard');
        },
    });

    if (error) return <p>SIGNUP_USER Error: {error.message}</p>;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            await signUp({ variables: { username, email, password } });
        } catch (err) {
            // Error handling here is redundant since onError in useMutation
            // will take care of it?
            console.error('handleSubmit Error:', err.message);
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
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
                <TextField
                    type="password"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                    Signup
                </Button>
            </form>
        </div>
    );
};

export default Signup;
