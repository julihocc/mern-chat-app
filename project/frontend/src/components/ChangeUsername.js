import React, {useEffect, useState} from 'react';
import {useChangeUsername} from "../hooks/mutations/useChangeUsername";
import {Button, TextField} from '@mui/material';
import logger from "../utils/logger";

export const ChangeUsername = () => {

    const [newUsername, setNewUsername] = useState('');
    const [usernameHasChanged, setUsernameHasChanged] = useState(false);

    const changeUsername = useChangeUsername(newUsername);

    const handleSubmit = async () => {
        try {
            await changeUsername({ variables: { newUsername } });
            await setUsernameHasChanged(true);

            // window.location.reload();
        } catch (error) {
            throw new Error(`Could not change username`)
        }
    };

    useEffect(() => {
        if (usernameHasChanged) {
            // window.location.reload();
            logger.debug(`Username has been changed to ${newUsername}`);
        }
    }, [usernameHasChanged]);

    return (
        <div>
            <TextField value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
            <Button onClick={handleSubmit}>Change Username</Button>
        </div>
    );
};
