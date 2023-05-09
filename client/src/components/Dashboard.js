// client/src/components/Dashboard.js
import React from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

// src/graphql/queries.js
import gql from 'graphql-tag';

import ChatList from "./ChatList";
import SendContactRequest from "./SendContactRequest";
import ContactRequests  from "./ContactRequests";

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            id
            email
        }
    }
`;


const Dashboard = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('Calling handleLogout()')
        // Remove the stored cookie
        console.log('document.cookie', document.cookie)
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        console.log('document.cookie', document.cookie)
        // Redirect the user to the login page
        navigate('/login')
    };

    const { loading, error, data } = useQuery(GET_CURRENT_USER);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>GET_CURRENT_USER Error: {error.message}</p>;

    const { getCurrentUser } = data;

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {getCurrentUser.email}!</p>
            <p>Your user ID is: {getCurrentUser.id}</p>
            <ContactRequests userId={getCurrentUser.id} />
            <SendContactRequest />
            <ChatList />
            <button onClick={handleLogout}>Logout</button>
        </div>

    );
};

export default Dashboard;
