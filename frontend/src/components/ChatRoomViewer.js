// ChatRoomViewer component
// Path: frontend\src\components\ChatRoomViewer.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';
import { Typography, TextField, Button } from '@mui/material'; // Import MUI components
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
    if (error) return <p>GET_USER)BY_ID Error: {error.message}</p>;

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
    // const error = chatRoom.error || messages.error || currentUser.error || sendMessageError;

    if (isLoading) {
        return <Loading queryName="Loading" />;
    }

    // if (error) {
    //     return <Error queryName="ChatRoomViewer Error" message={error.message} />;
    // }

    if (chatRoom.error)  return <Error queryName="chatRoom" message={chatRoom.error.message} />;
    if (messages.error)  return <Error queryName="messages" message={messages.error.message} />;
    if (currentUser.error)  return <Error queryName="currentUser" message={currentUser.error.message} />;
    if (sendMessageError)  return <Error queryName="sendMessage" message={sendMessageError.message} />;

    return (
        <div>
            <Typography variant="h2">Chat Room: {chatRoom.data.getChatRoom.id}</Typography>
            <ul>
                {messages.data.getMessagesByChatRoomId.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
            </ul>
            <form onSubmit={(e) => handleSendMessage(e, currentUser.data.getCurrentUser.id, chatRoom.data.getChatRoom.id)}>
                <TextField
                    type="body"
                    label="New Message"
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                    Send Message
                </Button>
            </form>
        </div>
    );
};

export default ChatRoomViewer;
