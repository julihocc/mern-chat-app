// path: frontend/src/components/SendContactRequestForm.js
import React, { useEffect, useState } from 'react';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import { TextField, Button, CircularProgress, Typography} from '@mui/material';
import { useTranslation } from "react-i18next";
import { SEND_CONTACT_REQUEST } from "../gql/mutations/SEND_CONTACT_REQUEST";
import { GET_CURRENT_USER } from "../gql/queries/GET_CURRENT_USER";
import { GET_USER_BY_EMAIL } from "../gql/queries/GET_USER_BY_EMAIL";

const SendContactRequestForm = () => {
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

    // useEffect(() => {
    //     // Check if the response data from the getUserByEmail query is available and if it is, proceed with sending the contact request
    //     if (getUserByEmailData) {
    //         sendContactRequest({
    //             variables: {
    //                 sender: currentUserData.getCurrentUser.id,
    //                 recipient: getUserByEmailData.getUserByEmail.id,
    //             },
    //         }).then(() => {
    //             setEmail('');
    //         }).catch((err) => {
    //             console.error(err);
    //         });
    //     }
    // }, [getUserByEmailData, currentUserData.getCurrentUser.id, sendContactRequest]); // Added missing dependencies

    useEffect(() => {
        if (getUserByEmailData && currentUserData?.getCurrentUser?.id) { // Added null checks
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
    }, [getUserByEmailData, currentUserData?.getCurrentUser?.id, sendContactRequest]); // Added optional chaining



    if (currentUserLoading || getUserByEmailLoading) return <CircularProgress />;
    if (currentUserError) return <p>Error: {currentUserError.message}</p>;

    if (getUserByEmailError) {
        // If the getUserByEmail query results in an error, set a custom error messages to inform the user that the recipient email does not exist
        setUserError('User with this email does not exist.');
    }

    return (
        <div>
            <Typography variant="h4">{t('sendContactRequest')}</Typography>
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
            {userError && <p>{userError}</p>}
            {sendContactError && <p>Error: {sendContactError.message}</p>}
        </div>
    );
};

export default SendContactRequestForm;
// No modifications were made to this piece of code. The current implementation seems appropriate for the intended functionality.
