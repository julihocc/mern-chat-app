// frontend\src\components\ContactListWithFullDetails.js
import React from 'react';
import logger from "loglevel";
import { useGetContactsWithFullDetails } from "../hooks/queries/useGetContactsWithFullDetails";


export const ContactListWithFullDetails = () => {

    const { loading, error, data } = useGetContactsWithFullDetails();
    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error : {error.message}</p>;

    const contacts = data.getContactsWithFullDetails;
    //logger.info(contacts);
    return (
        <div>
            <h3> Contacts </h3>
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
