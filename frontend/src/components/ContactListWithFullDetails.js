// frontend\src\components\ContactListWithFullDetails.js
import React from 'react';
import { useGetContactsWithFullDetails } from "../hooks/queries/useGetContactsWithFullDetails";
import {Typography} from "@mui/material";
import { useTranslation } from "react-i18next";


export const ContactListWithFullDetails = () => {
    const {t} = useTranslation();

    const { loading, error, data } = useGetContactsWithFullDetails();
    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error : {error.message}</p>;

    const contacts = data.getContactsWithFullDetails;
    //logger.debug(contacts);
    return (
        <div>
            <Typography variant="h4">{t('contacts')}</Typography>
            <ul>
                {contacts.map(contact => (
                    <li key={contact.id}>
                        <p>id: {contact.id}</p>
                        <p>email: {contact.email}</p>
                        <p>username: {contact.username}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
