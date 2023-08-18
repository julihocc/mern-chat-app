import React, { useEffect } from 'react'; // Import useEffect
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { fetchCurrentUser } from '../actions'; // Import the fetchCurrentUser thunk
import { Typography, Grid, CircularProgress, Alert } from '@mui/material';
import ChatRoomList from "./ChatRoomList";
import SendContactRequestForm from "./SendContactRequestForm";
import PendingContactRequestsList from "./PendingContactRequestsList";
import CreateGroupConversation from "./CreateGroupConversation";
import { useTranslation } from "react-i18next";
import log from '../utils/logger';
import { ContactListWithFullDetails } from "./ContactListWithFullDetails"; // Make sure the import is correct

const Dashboard = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch(); // Get dispatch function
    const { loading, user, error } = useSelector(state => state.currentUser); 
    // Select user data from Redux store

    useEffect(() => {
        // Dispatch the thunk to fetch the current user's data when the component mounts
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    if (loading) return <CircularProgress />;
    
    if (error) {
        log.error(`GET_CURRENT_USER Error: ${error}`);
        return <Alert severity="error">GET_CURRENT_USER Error: {error}</Alert>;
    }

    if (!user) {
        // Handle the case where user is null or undefined
        // You can return a loading indicator, an error message, or any other appropriate content
        return <div>Not user at all...</div>;
    }

    return (
        <Grid container spacing={3} direction="column">
            <Grid item>
                <Typography variant="h2">{t('dashboard')}</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body1">{t('welcome')}, {user.username}!</Typography>
            </Grid>
            <Grid item>
                <PendingContactRequestsList userId={user.id} />
            </Grid>
            <Grid item>
                <CreateGroupConversation userEmail={user.email} />
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
