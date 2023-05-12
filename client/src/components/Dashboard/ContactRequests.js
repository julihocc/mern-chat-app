import React from 'react';
import {useGetContactRequests, useAcceptContactRequest, useRejectContactRequest} from './ContactRequest/hooks';

const ContactRequests = ({userId}) => {
    const {loading, error, data} = useGetContactRequests(userId);
    const acceptContactRequest = useAcceptContactRequest(userId);
    const rejectContactRequest = useRejectContactRequest(userId);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message} </p>;

    const pendingRequests = data.getContactRequests.filter((request) => request.status === 'pending');

    return (
        <div>
            <h3> Contact Requests </h3>
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
