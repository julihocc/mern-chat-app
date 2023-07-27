// frontend\src\components\ContactList.js
import React from 'react';
import { useGetContacts } from './utils/hooks';
import log from "loglevel";

const ContactList = ({userId}) => {
    const {loading, error, data} = useGetContacts(userId);

    if (loading) return <p>Loading...</p>;
    if (error) {
        log.error('Error getting contacts: ', error.message)
        return <p>Error : {error.message} </p>;
    }

    // Assuming that data.getContacts is the array of contacts.
    const contacts = data.getContacts;

    return (
        <div>
            <h3>Contacts</h3>
            <ul>
                {contacts.map(({id}) => (
                    <li key={id}>
                        <p>id: {id}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ContactList;
