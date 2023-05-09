import React from 'react';
import {gql, useMutation, useQuery} from '@apollo/client';

const GET_CONTACT_REQUESTS = gql`
    query GetContactRequests($userId: ID!) {
        getContactRequests(userId: $userId) {
            id
            senderId
            recipientId
            status
            createdAt
        }
    }
`;

const ACCEPT_CONTACT_REQUEST = gql`
    mutation AcceptContactRequest($senderId: ID!, $recipientId: ID!) {
        acceptContactRequest(senderId: $senderId, recipientId: $recipientId) {
            createdAt
            id
            recipientId
            senderId
            status
        }
    }
`;

const REJECT_CONTACT_REQUEST = gql`
    mutation RejectContactRequest($senderIds: ID!, $recipientId: ID!) {
        rejectContactRequest(senderIds: $senderIds, recipientId: $recipientId) {
            createdAt
            id
            recipientId
            senderId
            status
        }
    }
`;

const ContactRequests = ({userId}) => {
    const {loading, error, data} = useQuery(GET_CONTACT_REQUESTS, {
        variables: {userId}, fetchPolicy: 'network-only', // ignore cache
    });

    const [acceptContactRequest] = useMutation(ACCEPT_CONTACT_REQUEST, {
        refetchQueries: [{query: GET_CONTACT_REQUESTS, variables: {userId}}],
    });

    const [rejectContactRequest] = useMutation(REJECT_CONTACT_REQUEST, {
        refetchQueries: [{query: GET_CONTACT_REQUESTS, variables: {userId}}],
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>GET_CONTACT_REQUESTS Error : {error.message} </p>;

    const pendingRequests = data.getContactRequests.filter((request) => request.status === 'pending');

    return (<div>
        <h3> Contact Requests </h3>
        <ul>
            {pendingRequests.map(({id, senderId, createdAt, status}) => (
                <li key={id}>
                    <p>senderId: {senderId}</p>
                    <p>createdAt: {createdAt}</p>
                    {status === "pending" && (
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
                    )}
                </li>))}
        </ul>
    </div>)
}

export default ContactRequests;