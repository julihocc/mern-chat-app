// Signup component
// Path: frontend\src\components\SignUp.js
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material'; // Import MUI components
import { useTranslation } from 'react-i18next'; // Import MUI components

// const SIGNUP = gql`
//     mutation SignUp($username: String!, $email: String!, $password: String!) {
//         signUp(username: $username, email: $email, password: $password) {
//             token
//             user {
//                 id
//                 username
//                 email
//             }
//         }
//     }
// `;

const SIGNUP = gql`
    mutation SignUp($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
        signUp(username: $username, email: $email, password: $password, confirmPassword: $confirmPassword) {
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
    const [confirmPassword, setConfirmPassword] = useState('');
    const { t } = useTranslation();

    const [signUp, { error }] = useMutation(SIGNUP, {
        onError(err) {
            console.error('Signup Error:', err.message);
            alert(err.message);
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

        // try {
        //     await signUp({ variables: { username, email, password } });
        // } catch (err) {
        //     console.error('handleSubmit Error:', err.message);
        // }
        try {
            await signUp({ variables: { username, email, password, confirmPassword } });
        } catch (err) {
            console.error('handleSubmit Error:', err.message);
        }

    };

    return (
        <div>
            <h2>{t('signup')}</h2>
            <form onSubmit={handleSubmit}>
                <TextField
                    label={t('username')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
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
                <TextField
                    type="password"
                    label={t('confirmPassword')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                    {t('signup')}
                </Button>
            </form>
        </div>
    );
};

export default Signup;
