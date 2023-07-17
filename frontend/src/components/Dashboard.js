// Dashboard component
// Path: frontend\src\components\Dashboard.js

import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography, Button, Grid, CircularProgress, Alert } from '@mui/material';
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


const Dashboard = ({ handleLogout }) => {
    const { loading, error, data } = useQuery(GET_CURRENT_USER);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">GET_CURRENT_USER Error: {error.message}</Alert>;

    const { getCurrentUser } = data;

    return (
        <Grid container spacing={3} direction="column">
            <Grid item>
                <Typography variant="h2">Dashboard</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body1">Welcome, {getCurrentUser.email}!</Typography>
                <Typography variant="body1">Your user ID is: {getCurrentUser.id}</Typography>
            </Grid>
            <Grid item>
                <ContactRequests userId={getCurrentUser.id} />
            </Grid>
            <Grid item>
                <CreateGroupConversation userEmail={getCurrentUser.email} />
            </Grid>
            <Grid item>
                <SendContactRequest />
            </Grid>
            <Grid item>
                <ChatList />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
