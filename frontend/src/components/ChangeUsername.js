import React, {useEffect, useState} from 'react';
import {useChangeUsername} from "../hooks/mutations/useChangeUsername";
import {Box, Button, TextField, Typography} from '@mui/material';
import logger from "../utils/logger";

export const ChangeUsername = () => {

    const [newUsername, setNewUsername] = useState('');
    const [usernameHasChanged, setUsernameHasChanged] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');

    const {changeUsername} = useChangeUsername();

    const handleSubmit = async () => {
        try {
            logger.debug(`Changing username to ${newUsername}`);
            logger.debug(currentPassword);
            await changeUsername({
                variables: {newUsername, currentPassword}
            });
            logger.debug(`Username changed to ${newUsername}`);
            await setUsernameHasChanged(true);
            logger.debug(`Username has been changed to ${newUsername}`);

            // window.location.reload();
        } catch (error) {
            throw new Error(`Could not change username: ${error.message}`);
        }
    };

    useEffect(() => {
        if (usernameHasChanged) {
            // window.location.reload();
            logger.debug(`Username has been changed to ${newUsername}`);
        }
    }, [usernameHasChanged, newUsername]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography variant="h6">Change Username</Typography>
            <TextField
                label="Current Password"
                type="password"
                variant="outlined"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                margin="normal"
            />
            <TextField
                label="New Username"
                variant="outlined"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Change Username
            </Button>
        </Box>
    );
};
