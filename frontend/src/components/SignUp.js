import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material'; // Import MUI components

const SIGNUP = gql`
    mutation SignUp($email: String!, $password: String!) {
        signUp(email: $email, password: $password) {
            token
            user {
                id
                email
            }
        }
    }
`;

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [signUp, { error }] = useMutation(SIGNUP, {
        onCompleted(data) {
            // Set JWT token as a cookie
            document.cookie = `token=${data.signUp.token}; path=/; max-age=3600`;
            // Navigate to dashboard after successful signup
            navigate('/dashboard');
        },
    });

    if (error) return <p>SIGNUP_USER Error: {error.message}</p>;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signUp({ variables: { email, password } });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Signup</h2>
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
                    Signup
                </Button>
            </form>
        </div>
    );
};

export default Signup;
