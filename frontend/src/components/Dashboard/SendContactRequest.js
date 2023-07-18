// frontend\src\components\Dashboard\SendContactRequest.js

import React, { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import { TextField, Button, CircularProgress, Typography, Alert } from '@mui/material';
import { useTranslation } from "react-i18next";

const SEND_CONTACT_REQUEST = gql`
    mutation SendContactRequest($senderId: ID!, $recipientId: ID!) {
        sendContactRequest(senderId: $senderId, recipientId: $recipientId) {
            id
            senderId
            recipientId
            status
            createdAt
        }
    }
`;

const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            id
            email
        }
    }
`;

const GET_USER_BY_EMAIL = gql`
    query GetUserByEmail($email: String!) {
        getUserByEmail(email: $email) {
            id
            email
        }
    }
`;

const SendContactRequest = () => {
    const {t} = useTranslation();
    const [email, setEmail] = useState('');
    const [userError, setUserError] = useState(null);

    const {
        data: currentUserData,
        loading: currentUserLoading,
        error: currentUserError,
    } = useQuery(GET_CURRENT_USER);

    const [sendContactRequest, {
        loading: sendContactLoading,
        error: sendContactError,
    }] = useMutation(SEND_CONTACT_REQUEST);

    const [getUserByEmail, {
        loading: getUserByEmailLoading,
        error: getUserByEmailError,
        data: getUserByEmailData,
    }] = useLazyQuery(GET_USER_BY_EMAIL);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUserError(null);

        // Load recipient user when form is submitted
        await getUserByEmail({ variables: { email } });
    };

    useEffect(() => {
        if (getUserByEmailData) {
            sendContactRequest({
                variables: {
                    senderId: currentUserData.getCurrentUser.id,
                    recipientId: getUserByEmailData.getUserByEmail.id,
                },
            }).then(() => {
                setEmail('');
            }).catch((err) => {
                console.error(err);
            });
        }
    }, [getUserByEmailData]);

    if (currentUserLoading || getUserByEmailLoading) return <CircularProgress />;
    if (currentUserError) return <Alert severity="error">Error: {currentUserError.message}</Alert>;

    if (getUserByEmailError) {
        setUserError('User with this email does not exist.');
    }

    return (
        <div>
            <Typography variant="h3">{t('sendContactRequest')}</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    type="email"
                    label={t('email')}
                    placeholder={t('enterEmail')}
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" disabled={sendContactLoading}>
                    {sendContactLoading ? t('sending') : t('send')}
                </Button>
            </form>
            {userError && <Alert severity="error">{userError}</Alert>}
            {sendContactError && <Alert severity="error">Error: {sendContactError.message}</Alert>}
        </div>
    );
};

export default SendContactRequest;
