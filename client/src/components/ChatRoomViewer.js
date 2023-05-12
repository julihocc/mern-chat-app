import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import Loading from './ChatRoomViewer/Loading';
import Error from './ChatRoomViewer/Error';
import useChatRoomQuery from './ChatRoomViewer/useChatRoomQuery';
import useMessageSender from './ChatRoomViewer/useMessageSender';

const GET_USER_BY_ID = gql`
    query GetUserById($userId: ID!) {
        getUserById(userId: $userId) {
            id
            email
        }
    }
`;

const Message = ({ message }) => {
    const { loading, error, data } = useQuery(GET_USER_BY_ID, {
        variables: { userId: message.senderId },
    });

    if (loading) return <p>Loading sender info...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <li key={message.id}>
            {data.getUserById.email}: {message.body}
        </li>
    );
};

const ChatRoomViewer = () => {
    const { id } = useParams();
    const { chatRoom, messages, currentUser } = useChatRoomQuery(id);
    const { messageBody, setMessageBody, handleSendMessage, sendMessageLoading, sendMessageError } = useMessageSender();

    const isLoading = chatRoom.loading || messages.loading || currentUser.loading || sendMessageLoading;
    const error = chatRoom.error || messages.error || currentUser.error || sendMessageError;

    if (isLoading) {
        return <Loading queryName="Loading" />;
    }

    if (error) {
        return <Error queryName="Error" message={error.message} />;
    }

    return (
        <div>
            <h2>Chat Room: {chatRoom.data.getChatRoom.id}</h2>
            <ul>
                {messages.data.getMessagesByChatRoomId.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
            </ul>
            <form onSubmit={(e) => handleSendMessage(e, currentUser.data.getCurrentUser.id, chatRoom.data.getChatRoom.id)}>
                <input
                    type="text"
                    placeholder="New Message"
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                />
                <button type="submit">Send Message</button>
            </form>
        </div>
    );
};

export default ChatRoomViewer;
