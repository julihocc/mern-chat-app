import React, {useState} from 'react';
import {useChangeUsername} from "../hooks/mutations/useChangeUsername";
import { Button, TextField } from '@mui/material';
export const ChangeUsername = () => {
    const [newUsername, setNewUsername] = useState('');
    const changeUsername = useChangeUsername(newUsername);

    const handleSubmit = async () => {
        try {
            await changeUsername({ variables: { newUsername } });
            // Handle success, e.g., show a success message or redirect
        } catch (error) {
            // Handle error, e.g., show an error message
        }
    };

    return (
        <div>
            <TextField value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
            <Button onClick={handleSubmit}>Change Username</Button>
        </div>
    );
};
