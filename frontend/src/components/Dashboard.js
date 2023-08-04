// Path: frontend\src\components\dashboardUtils.js
import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography, Grid, CircularProgress, Alert } from '@mui/material';
import ChatRoomList from "./ChatRoomList";
import SendContactRequestForm from "./SendContactRequestForm";
import PendingContactRequestsList from "./PendingContactRequestsList";
import CreateGroupConversation from "./CreateGroupConversation";
import { GET_CURRENT_USER } from "../gql/queries/GET_CURRENT_USER";
import { useTranslation } from "react-i18next";

import log from '../utils/logger';
import {ContactListWithFullDetails} from "./ContactListWithFullDetails"; // Imported the custom logger

const Dashboard = () => {
    const {t} = useTranslation();
    // const { loading, error, data } = useQuery(GET_CURRENT_USER);
    const { loading, error, data } = useQuery(GET_CURRENT_USER, {
        onError: (error) => {
            log.error(`GET_CURRENT_USER Error: ${error.message}`);
        },
    });
    if (loading) return <CircularProgress />;
    if (error) {
        log.error(`GET_CURRENT_USER Error: ${error.message}`); // Replaced console.error with custom logger
        return <Alert severity="error">GET_CURRENT_USER Error: {error.message}</Alert>; // Keep error message display
    }

    const { getCurrentUser } = data;

    return (
        <Grid container spacing={3} direction="column">
            <Grid item>
                <Typography variant="h2">{t('dashboard')}</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body1">{t('welcome')}, {getCurrentUser.username}!</Typography>
            </Grid>
            <Grid item>
                <PendingContactRequestsList userId={getCurrentUser.id} />
            </Grid>
            <Grid item>
                <CreateGroupConversation userEmail={getCurrentUser.email} />
            </Grid>
            <Grid item>
                <SendContactRequestForm />
            </Grid>
            <Grid item>
                <ChatRoomList />
            </Grid>
            <Grid item>
                <ContactListWithFullDetails />
            </Grid>
        </Grid>
    );
};

export default Dashboard;

// I replaced instances of console.error with our custom logger. The Alert component remains to handle user notifications in case of errors.
