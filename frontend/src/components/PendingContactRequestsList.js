// path: frontend/src/components/PendingContactRequestsList.js
import React from 'react';
import { useGetContactRequestsByContext } from '../hooks/queries/useGetContactRequestsByContext';
import { useAcceptContactRequest } from '../hooks/mutations/useAcceptContactRequest';
import { useRejectContactRequest } from '../hooks/mutations/useRejectContactRequest';
import { useTranslation } from "react-i18next";
import logger from "loglevel";

const PendingContactRequestsList = ({ userId }) => {
    // Always call hooks at the top level
    const { t } = useTranslation();
    const { loading, error, data, refetch } = useGetContactRequestsByContext();
    const acceptContactRequestHandler = useAcceptContactRequest(userId);
    const rejectContactRequestHandler = useRejectContactRequest(userId);

    // Check for conditions later in the code
    if (!refetch) {
        logger.error("refetch is not available");
        return null;
    }

    if (loading) return <p>{t('loading')}</p>;
    if (error) return <p>{t('error')} : {error.message}</p>;

    const pendingRequests = data.getContactRequestsByContext.filter(request => request.status === 'pending');

    if (pendingRequests.length === 0) return null;

    return (
        <div>
            <h3>{t('contactRequest')}</h3>
            <ul>
                {pendingRequests.map(({ id, senderId, status, createdAt }) => (
                    <li key={id}>
                        {/* Rendering details */}
                        <p>id: {id}</p>
                        <p>sender: {senderId}</p>
                        <p>status: {status}</p>
                        <p>createdAt: {createdAt}</p>
                        <div>
                            <button onClick={async () => {
                                try {
                                    await acceptContactRequestHandler({ variables: { requestId: id } });
                                    refetch();
                                } catch (error) {
                                    logger.error('Error accepting contact request:', error);
                                }
                            }}>Accept</button>

                            <button onClick={async () => {
                                try {
                                    await rejectContactRequestHandler({ variables: { requestId: id } });
                                    refetch();
                                } catch (error) {
                                    logger.error('Error rejecting contact request:', error);
                                }
                            }}>Reject</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PendingContactRequestsList;
