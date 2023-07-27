// frontend\src\components\dashboardUtils\ContactRequests.js
import React from 'react';
import {useGetContactRequests, useAcceptContactRequest, useRejectContactRequest} from './dashboardUtils/hooks';
import { useTranslation } from "react-i18next";
import log from "loglevel";

const ContactRequests = ({userId}) => {

    log.info('ContactRequests userId: ', userId)

    const {t} = useTranslation();
    const {loading, error, data} = useGetContactRequests(userId);
    const acceptContactRequestHandler = useAcceptContactRequest(userId);
    const rejectContactRequestHandler = useRejectContactRequest(userId);

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
                            <button onClick={async () => { // This becomes an async function
                                try {
                                    log.info('Accept contact request');
                                    await acceptContactRequestHandler({variables: {requestId: id}}); // Use the handler here with the requestId
                                } catch (error) {
                                    log.error('Error accepting contact request:', error);
                                }
                            }}>Accept
                            </button>
                            <button onClick={async () => { // This becomes an async function
                                try {
                                    log.info('Reject contact request');
                                    await rejectContactRequestHandler({variables: {requestId: id}}); // Use the handler here with the requestId
                                } catch (error) {
                                    log.error('Error rejecting contact request:', error);
                                }
                            }}>Reject
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ContactRequests;
