// frontend\src\components\Dashboard\CreateGroupConversation.js

import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { TextField, Button, CircularProgress, Typography, Alert, Snackbar } from '@mui/material';

const CREATE_GROUP_CONVERSATION = gql`
    mutation CreateGroupConversation($emails: [String!]!) {
        createGroupConversation(emails: $emails) {
            id
        }
    }
`;

const CreateGroupConversation = ({ userEmail }) => {
    const [emailsInput, setEmailsInput] = useState('');
    const [createGroupConversation, { data, loading, error }] = useMutation(CREATE_GROUP_CONVERSATION);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const additionalEmails = emailsInput.split(',').map(email => email.trim());
        const emails = [userEmail, ...additionalEmails];

        await createGroupConversation({ variables: { emails } });

        if (!error) {
            setEmailsInput('');  // clear the input field after successful submission
            setOpenSnackbar(true); // show success message
        }
    };

    return (
        <div>
            <Typography variant="h2">Create Group Conversation</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="emails"
                    label="Emails"
                    placeholder="Enter comma-separated emails"
                    variant="outlined"
                    value={emailsInput}
                    onChange={(e) => setEmailsInput(e.target.value)}
                    fullWidth
                />
                <Button type="submit" variant="contained" color="primary" disabled={loading}>Create</Button>
            </form>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">CREATE_GROUP_CONVERSATION Error: {error.message}</Alert>}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={`Group Conversation ID: ${data?.createGroupConversation.id}`}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
        </div>
    );
};

export default CreateGroupConversation;
