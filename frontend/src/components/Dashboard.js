// frontend/src/components/Dashboard.js
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, CircularProgress, Container, Grid, Typography} from '@mui/material';
import SendContactRequestForm from './SendContactRequestForm';
import PendingContactRequestsList from './PendingContactRequestsList';
import CreateGroupConversation from './CreateGroupConversation';
import {useTranslation} from 'react-i18next';
import logger from '../utils/logger';
// Import the new action creator
import {initiateFetchCurrentUser} from '../redux/actions';
import {Gravatar} from "./Gravatar";
import ChatRoomList from './ChatRoomList';
import {ContactListWithChatRoom} from "./ContactListWithChatRoom";
import {Link} from "react-router-dom";

const Dashboard = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const {loading, error, isLoggedIn, email, username} = useSelector(
        (state) => state.user
    );
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
    return (<Container>
        <Grid container spacing={3} direction="column">

            <Grid container direction="row" spacing={10}>

                {/* Column 1 */}
                <Grid item xs={12} sm={8} md={7}>
                    {/*<Grid container direction="column" spacing={3}>*/}
                        <Grid item>
                            <Typography>
                                <Typography variant="h1">
                                    {t('dashboard')}
                                </Typography>
                                {t('welcome')}, {username || email || t('guest')}!
                            </Typography>
                        </Grid>
                        <Grid item>
                            <PendingContactRequestsList/>
                        </Grid>
                        <Grid item>
                            <CreateGroupConversation/>
                        </Grid>
                        <Grid item>
                            <SendContactRequestForm/>
                        </Grid>
                    {/*</Grid>*/}
                </Grid>

                {/* Column 2 */}
                <Grid item xs={12} sm={4} md={5}>
                    <Grid item>
                        <Gravatar/>
                    </Grid>
                    <Grid item>
                        <ChatRoomList/>
                    </Grid>
                    <Grid item>
                        <ContactListWithChatRoom/>
                    </Grid>
                    <Grid item>
                        <Link to="/settings">
                            <Typography variant="h3">{t('settings')}</Typography>
                        </Link>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Container>)
};

export default Dashboard;
