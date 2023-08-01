// frontend\src\components\ContactList.js
import React from 'react';
import logger from "loglevel";
import { useGetCurrentUser } from "../hooks/hooksHub";


const ContactList = () => {
    const {loading, error, data} = useGetCurrentUser();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message} </p>;

    const contacts = data.getCurrentUser.contacts
    logger.info(contacts);
    return (
        <div>
            <h3> Contacts </h3>
            <ul>
                {contacts.map(id => (
                    <li key={id}>
                        <p>id: {id}</p>
                    </li>
                ))}
            </ul>
        </div>
    );

}

export default ContactList;
