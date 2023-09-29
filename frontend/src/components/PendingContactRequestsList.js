// path: frontend/src/components/PendingContactRequestsList.js
import React from 'react';
import { useGetContactRequestsByContext } from '../hooks/queries/useGetContactRequestsByContext';
import { useAcceptContactRequest } from '../hooks/mutations/useAcceptContactRequest';
import { useRejectContactRequest } from '../hooks/mutations/useRejectContactRequest';
import { useTranslation } from "react-i18next";
import logger from "loglevel";

const PendingContactRequestsList = ({userId}) => {

    const {t} = useTranslation();
    const {loading, error, data} = useGetContactRequestsByContext();
    const acceptContactRequestHandler = useAcceptContactRequest(userId);
    const rejectContactRequestHandler = useRejectContactRequest(userId);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message} </p>;

    // const pendingRequests = data.getContactRequestsByContext // Use the data from the query here
    const pendingRequests = data.getContactRequestsByContext.filter((request) => request.status === 'pending');

    // Don't render anything if there are no pending requests
    if (pendingRequests.length === 0) return null;

    return (
        <div>
            <h3> {t('contactRequest')} </h3>
            <ul>
                {pendingRequests.map(({id, senderId, status, createdAt}) => (
                    <li key={id}>
                        <p>id: {id}</p>
                        <p>sender: {senderId}</p>
                        <p>status: {status}</p>
                        <p>createdAt: {createdAt}</p>
                        <div>
                            <button onClick={async () => { // This becomes an async function
                                try {
                                    //logger.info('Accept contact request');
                                    await acceptContactRequestHandler({variables: {requestId: id}}); // Use the handler here with the requestId
                                } catch (error) {
                                    logger.error('Error accepting contact request:', error);
                                }
                            }}>Accept
                            </button>
                            <button onClick={async () => { // This becomes an async function
                                try {
                                    //logger.info('Reject contact request');
                                    await rejectContactRequestHandler({variables: {requestId: id}}); // Use the handler here with the requestId
                                } catch (error) {
                                    logger.error('Error rejecting contact request:', error);
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

export default PendingContactRequestsList;
