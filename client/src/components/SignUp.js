import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useNavigate } from 'react-router-dom';

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
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
