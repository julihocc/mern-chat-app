import React, {useEffect, useState} from 'react';
import { useMutation, useLazyQuery, useQuery, gql } from '@apollo/client';

const SEND_CONTACT_REQUEST = gql`
    mutation SendContactRequest($senderId: ID!, $recipientId: ID!) {
        sendContactRequest(senderId: $senderId, recipientId: $recipientId) {
            id
            senderId
            recipientId
            status
            createdAt
        }
    }
`;

const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            id
            email
        }
    }
`;

const GET_USER_BY_EMAIL = gql`
    query GetUserByEmail($email: String!) {
        getUserByEmail(email: $email) {
            id
            email
        }
    }
`;

const SendContactRequest = () => {
    const [email, setEmail] = useState('');
    const [userError, setUserError] = useState(null);

    const {
        data: currentUserData,
        loading: currentUserLoading,
        error: currentUserError,
    } = useQuery(GET_CURRENT_USER);

    const [sendContactRequest, {
        loading: sendContactLoading,
        error: sendContactError,
    }] = useMutation(SEND_CONTACT_REQUEST);

    const [getUserByEmail, {
        loading: getUserByEmailLoading,
        error: getUserByEmailError,
        data: getUserByEmailData,
    }] = useLazyQuery(GET_USER_BY_EMAIL);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUserError(null);

        // Load recipient user when form is submitted
        await getUserByEmail({variables: {email}});
    };

    useEffect(() => {
        if (getUserByEmailData) {
            sendContactRequest({
                variables: {
                    senderId: currentUserData.getCurrentUser.id,
                    recipientId: getUserByEmailData.getUserByEmail.id,
                },
            }).then(() => {
                setEmail('');
            }).catch((err) => {
                console.error(err);
            });
        }
    }, [getUserByEmailData]);

    if (currentUserLoading || getUserByEmailLoading) return <p>Loading...</p>;
    if (currentUserError) return <p>Error: {currentUserError.message}</p>;
    if (getUserByEmailError) {
        setUserError('User with this email does not exist.');
    }



    return (
        <div>
            <h2>Send Contact Request</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" disabled={sendContactLoading}>
                    {sendContactLoading ? 'Sending...' : 'Send Contact Request'}
                </button>
            </form>
            {userError && <p>{userError}</p>}
            {sendContactError && <p>Error: {sendContactError.message}</p>}
        </div>
    );
};

export default SendContactRequest;
