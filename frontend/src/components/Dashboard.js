import React, { useEffect } from 'react'; // Import useEffect
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { CircularProgress, Grid, Typography } from '@mui/material';
import ChatRoomList from "./ChatRoomList";
import SendContactRequestForm from "./SendContactRequestForm";
import PendingContactRequestsList from "./PendingContactRequestsList";
import CreateGroupConversation from "./CreateGroupConversation";
import { useTranslation } from "react-i18next";
import log from '../utils/logger';
import ContactListWithFullDetails from "./ContactListWithFullDetails"; // Ensure the import is correct

// Import the fetchCurrentUser saga action
import { fetchCurrentUser } from '../redux/actions';

const Dashboard = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch(); // Get dispatch function

    // Adjusted based on the new merged userSlice
    const { loading, user, error, isLoggedIn } = useSelector(state => state.user);

    useEffect(() => {
        // Dispatch the saga action to fetch the current user's data when the component mounts
        if (isLoggedIn) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, isLoggedIn]);

    if (loading) return <CircularProgress />;

    if (error) {
        log.error(`GET_CURRENT_USER Error: ${error}`);
    }

    if (!user) {
        // Handle the case where user is null or undefined
        return <div>No user at all...</div>;
    }

    return (
        <Grid container spacing={3} direction="column">
            <Grid item>
                <Typography variant="h2">{t('dashboard')}</Typography>
            </Grid>
            <Grid item>
                <Typography variant="h3">{t('welcome')}, {user.username}!</Typography>
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
