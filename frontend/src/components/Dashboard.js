// frontend/src/components/Dashboard.js
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, CircularProgress, Grid, Typography} from '@mui/material';
import ChatRoomList from './ChatRoomList';
import SendContactRequestForm from './SendContactRequestForm';
import PendingContactRequestsList from './PendingContactRequestsList';
import CreateGroupConversation from './CreateGroupConversation';
import {useTranslation} from 'react-i18next';
import logger from '../utils/logger';
import {ContactListWithFullDetails} from './ContactListWithFullDetails';
import {ChangeUsername} from './ChangeUsername';
// Import the new action creator
import {initiateFetchCurrentUser} from '../redux/actions';
import {Gravatar} from './Gravatar';
import {Sidebar} from './Sidebar';
import {Container} from '@mui/material';

const Dashboard = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const {loading, error, isLoggedIn, email, username, user} = useSelector((state) => state.user);
    useEffect(() => {
        if (isLoggedIn) {
            // Use the new action creator
            dispatch(initiateFetchCurrentUser());
        }
    }, [dispatch, isLoggedIn]);

    // Show a loader while the request is in progress
    if (loading) return <CircularProgress/>;

    // Handle error by showing an alert and logging it
    if (error) {
        logger.error(`GET_CURRENT_USER Error: ${error}`);
        return <Alert severity="error">{t('An error occurred')}</Alert>;
    }

    // Handle case when user data is unavailable and not logged in
    if (!isLoggedIn) {
        return <div>Please log in.</div>;
    }

    // Render the main dashboard layout
    return (
<Container>
                <Sidebar/>
                <Grid container spacing={3} direction="column">
            <Grid item>
                <Typography variant="h1">{t('dashboard')}</Typography>
            </Grid>
            <Grid container justifyContent="center" alignItems="center">
                <Typography variant="h2">
                    {t('welcome')}, {username || email || t('guest')}!
                </Typography>
            </Grid>
            <Grid item>
                <PendingContactRequestsList userId={user.id}/>
            </Grid>
            <Grid item>
                <CreateGroupConversation/>
            </Grid>
            <Grid item>
                <SendContactRequestForm/>
            </Grid>
            <Grid item>
                {/*TODO Fixed the needing of refreshing to see new username*/}
                <ChangeUsername/>
            </Grid>
        </Grid>
</Container>
    )
};

export default Dashboard;
