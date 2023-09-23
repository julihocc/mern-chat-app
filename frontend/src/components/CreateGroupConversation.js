// frontend\src\components\CreateGroupConversation.js

import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { TextField, Button, CircularProgress, Typography,Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import logger from "../utils/logger";

const CREATE_GROUP_CONVERSATION = gql`
    mutation CreateGroupConversation($emails: [String!]!) {
        createGroupConversation(emails: $emails) {
            id
        }
    }
`;

const CreateGroupConversation = ({ userEmail }) => {
    const { t } = useTranslation();
    const [emailsInput, setEmailsInput] = useState('');
    const [createGroupConversation, { data, loading, error }] = useMutation(CREATE_GROUP_CONVERSATION);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const additionalEmails = emailsInput.split(',').map(email => email.trim());
        const emails = [userEmail, ...additionalEmails];
        logger.debug('CreateGroupConversation: handleSubmit: emails:', emails);

        await createGroupConversation({ variables: { emails } });

        if (!error) {
            setEmailsInput('');  // clear the input field after successful submission
            setOpenSnackbar(true); // show success messages
        }
    };

    return (
        <div>
            <Typography variant="h4">{t('createGroupConversation')}</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="emails"
                    label={t('emails')}
                    placeholder={t('enterCommaSeparatedEmails')}
                    variant="outlined"
                    value={emailsInput}
                    onChange={(e) => setEmailsInput(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" disabled={loading}>{t('create')}</Button>
            </form>
            {loading && <CircularProgress />}
            {error && <p>CREATE_GROUP_CONVERSATION Error: {error.message}</p>}
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
