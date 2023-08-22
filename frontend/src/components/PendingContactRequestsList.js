// path: frontend/src/components/PendingContactRequestsList.js
import React from 'react';
import { useGetContactRequestsByContext } from '../hooks/queries/useGetContactRequestsByContext';
import { useAcceptContactRequest } from '../hooks/mutations/useAcceptContactRequest';
import { useRejectContactRequest } from '../hooks/mutations/useRejectContactRequest';
import { useTranslation } from "react-i18next";
import logger from "loglevel";

const PendingContactRequestsList = ({userId}) => {

    const {t} = useTranslation();
    const {loading, error, data, refetch} = useGetContactRequestsByContext(); // Assuming refetch is returned here
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
                            <button onClick={async () => {
                                try {
                                    await acceptContactRequestHandler({variables: {requestId: id}});
                                    refetch(); // Refetch data after accepting
                                } catch (error) {
                                    logger.error('Error accepting contact request:', error);
                                }
                            }}>Accept
                            </button>
                            <button onClick={async () => {
                                try {
                                    await rejectContactRequestHandler({variables: {requestId: id}});
                                    refetch(); // Refetch data after rejecting
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
