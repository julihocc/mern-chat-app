// frontend\src\components\Dashboard\ContactRequests.js
import React from 'react';
import {useGetContactRequests, useAcceptContactRequest, useRejectContactRequest} from './ContactRequest/hooks';
import { useTranslation } from "react-i18next";

const ContactRequests = ({userId}) => {
    const {t} = useTranslation();
    const {loading, error, data} = useGetContactRequests(userId);
    const acceptContactRequest = useAcceptContactRequest(userId);
    const rejectContactRequest = useRejectContactRequest(userId);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message} </p>;

    const pendingRequests = data.getContactRequests.filter((request) => request.status === 'pending');

    // Don't render anything if there are no pending requests
    if (pendingRequests.length === 0) return null;

    return (
        <div>
            <h3> {t('contactRequest')} </h3>
            <ul>
                {pendingRequests.map(({id, senderId, createdAt}) => (
                    <li key={id}>
                        <p>senderId: {senderId}</p>
                        <p>createdAt: {createdAt}</p>
                        <div>
                            <button onClick={() => acceptContactRequest({
                                variables: {
                                    senderId,
                                    recipientId: userId
                                }
                            })}>Accept
                            </button>
                            <button onClick={() => rejectContactRequest({
                                variables: {
                                    senderId,
                                    recipientId: userId
                                }
                            })}>Reject
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ContactRequests;
