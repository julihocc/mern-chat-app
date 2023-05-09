import React, {useState} from 'react';
import {useMutation, useApolloClient} from '@apollo/client';
import gql from 'graphql-tag';
import {useNavigate} from 'react-router-dom';

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
                id,
                email
            }
        }
    }
`;

const Login = () => {

    const navigate = useNavigate();
    const client = useApolloClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



    const [loginUser, {error}] = useMutation(LOGIN_USER, {
        onCompleted(data) {
            console.log('Calling onCompleted(data)')
            console.log('data', data)
            // Set JWT token as a cookie
            console.log('data.login.token', data.login.token)
            console.log('data.login.user', data.login.user.email)
            document.cookie = `token=${data.login.token}; path=/; max-age=3600`;
            console.log('document.cookie', document.cookie)

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

        try {
            await loginUser({variables: {email, password}});
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Login</h2>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
