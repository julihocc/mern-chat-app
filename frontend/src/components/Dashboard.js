import React from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Typography, Button } from '@mui/material'; // Import MUI components

import ChatList from "./Dashboard/ChatList";
import SendContactRequest from "./Dashboard/SendContactRequest";
import ContactRequests from "./Dashboard/ContactRequests";
import CreateGroupConversation from "./Dashboard/CreateGroupConversation";
import gql from "graphql-tag";

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
        console.log('Calling handleLogout()');
        // Remove the stored cookie
        console.log('document.cookie', document.cookie);
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        console.log('document.cookie', document.cookie);
        // Redirect the user to the login page
        navigate('/login');
    };

    const { loading, error, data } = useQuery(GET_CURRENT_USER);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>GET_CURRENT_USER Error: {error.message}</p>;

    const { getCurrentUser } = data;

    return (
        <div>
            <Typography variant="h2">Dashboard</Typography>
            <Typography variant="body1">
                Welcome, {getCurrentUser.email}!
            </Typography>
            <Typography variant="body1">
                Your user ID is: {getCurrentUser.id}
            </Typography>
            <ContactRequests userId={getCurrentUser.id} />
            <CreateGroupConversation userEmail={getCurrentUser.email} />
            <SendContactRequest />
            <ChatList />
            <Button variant="contained" color="primary" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
};

export default Dashboard;
