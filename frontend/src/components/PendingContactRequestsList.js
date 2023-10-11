// path: frontend/src/components/PendingContactRequestsList.js
import React, {useEffect, useState} from 'react';
import {useGetContactRequestsByContext} from '../hooks/queries/useGetContactRequestsByContext';
import {useAcceptContactRequest} from '../hooks/mutations/useAcceptContactRequest';
import {useRejectContactRequest} from '../hooks/mutations/useRejectContactRequest';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import logger from "../utils/logger";

const PendingContactRequestsList = () => {
    const {id} = useSelector((state) => state.user);
    const userId = id;
    const {t} = useTranslation();
    const {loading, error, data, refetch} = useGetContactRequestsByContext();
    const acceptContactRequestHandler = useAcceptContactRequest(userId);
    const rejectContactRequestHandler = useRejectContactRequest(userId);
    const [refreshKey, setRefreshKey] = useState(0);

    const forceUpdate = () => {
        setRefreshKey(oldKey => oldKey +1);
    }

    useEffect(() => {
        refetch();
    }, [refreshKey]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message} </p>;

    // const pendingRequests = data.getContactRequestsByContext // Use the data from the query here
    const pendingRequests = data.getContactRequestsByContext.filter((request) => request.status === 'pending');

    // Don't render anything if there are no pending requests
    if (pendingRequests.length === 0) return null;

    return (<div>
            <h3> {t('contactRequest')} </h3>
            <ul>
                {pendingRequests.map(({id, senderId, status, createdAt}) => (<li key={id}>
                        <p>sender: {senderId.email}</p>
                        <p>status: {status}</p>
                        <p>createdAt: {Date(createdAt)}</p>
                        <div>
                            <button onClick={async () => { // This becomes an async function
                                try {
                                    await acceptContactRequestHandler({variables: {requestId: id}});
                                    forceUpdate();
                                } catch (error) {
                                    logger.error('Error accepting contact request:', error);
                                }
                            }}>Accept
                            </button>
                            <button onClick={async () => { // This becomes an async function
                                try {
                                    await rejectContactRequestHandler({variables: {requestId: id}});
                                    forceUpdate();
                                } catch (error) {
                                    logger.error('Error rejecting contact request:', error);
                                }
                            }}>Reject
                            </button>
                        </div>
                    </li>))}
            </ul>
        </div>)
}

export default PendingContactRequestsList;
