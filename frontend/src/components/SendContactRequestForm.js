// frontend/src/components/SendContactRequestForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from "react-i18next";
import { sendContactRequest, getUserByEmail } from '../redux/slices/contactRequestSlice';
import { selectCurrentUser } from '../redux/slices/userSlice'; // Assuming you have a selector for the current user

const SendContactRequestForm = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState(''); // Initialize local state for email input
    const dispatch = useDispatch();
    
    // Using selectors to get state from Redux store
    const { userByEmail, loading: contactLoading, error: contactError } = useSelector((state) => state.contact);
    const currentUser = useSelector(selectCurrentUser); // Assuming you have a selector for this
    
    useEffect(() => {
        // Check if userByEmail and currentUser are not null or undefined
        if (userByEmail && currentUser) {
            // Dispatch action to send contact request
            dispatch(sendContactRequest({
                senderId: currentUser.id,
                recipientId: userByEmail.id,
            }));
        }
    }, [userByEmail, dispatch, currentUser]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Dispatch Redux action to get user by email
        dispatch(getUserByEmail(email));
    };
    
    // Handling loading and error states
    if (contactLoading) return <CircularProgress />;
    if (contactError) return <p>Error: {contactError.message}</p>;
    
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
                <Button type="submit" variant="contained" color="primary">
                    {contactLoading ? t('sending') : t('send')}
                </Button>
            </form>
            {contactError && <p>{contactError.message}</p>}
        </div>
    );
};

export default SendContactRequestForm;
