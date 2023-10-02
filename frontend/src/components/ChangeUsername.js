import React, {useEffect, useState} from 'react';
import {useChangeUsername} from "../hooks/mutations/useChangeUsername";
import {Alert, Button, TextField} from '@mui/material';
import {useTranslation} from "react-i18next";
import logger from "../utils/logger";
export const ChangeUsername = () => {
    const { t } = useTranslation();
    const [newUsername, setNewUsername] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [usernameHasChanged, setUsernameHasChanged] = useState(false);
    const changeUsername = useChangeUsername(newUsername);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await changeUsername({ variables: { newUsername } });
            await setUsernameHasChanged(true);
            // window.location.reload();
        } catch (error) {
            throw new Error(`Could not change username`)
        } finally {
            await setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (usernameHasChanged) {
            // window.location.reload();
            logger.info(`Username has been changed to ${newUsername}`);
        }
    }, [usernameHasChanged]);

    return (
        <div>
            <TextField value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
            <Button onClick={handleSubmit}>Change Username</Button>
        </div>
    );
};
