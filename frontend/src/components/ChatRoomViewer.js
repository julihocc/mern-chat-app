// ChatRoomViewer component
// Path: frontend\src\components\ChatRoomViewer.js
import { Box, Stack, Paper, TextField, Button, Typography, CssBaseline, Container } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';
// import { Typography, TextField, Button } from '@mui/material'; // Import MUI components
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

const Message = ({ message, isCurrentUser }) => {
    const { loading, error, data } = useQuery(GET_USER_BY_ID, {
        variables: { userId: message.senderId },
    });

    if (loading) return <p>Loading sender info...</p>;
    if (error) return <p>GET_USER)BY_ID Error: {error.message}</p>;

    return (
        <Box
            sx={{
                mb: 1,
                p: 1,
                backgroundColor: isCurrentUser ? 'primary.light' : 'grey.300',
                color: isCurrentUser ? 'primary.contrastText' : 'grey.900',
                alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
            }}
        >
            <Typography variant="subtitle2">{data.getUserById.email}</Typography>
            <Typography variant="body2">{message.body}</Typography>
        </Box>
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

    if (chatRoom.error)  return <Error queryName="chatRoom" message={chatRoom.error.message} />;
    if (messages.error)  return <Error queryName="messages" message={messages.error.message} />;
    if (currentUser.error)  return <Error queryName="currentUser" message={currentUser.error.message} />;
    if (sendMessageError)  return <Error queryName="sendMessage" message={sendMessageError.message} />;

    // return (
    //     <div>
    //         <Typography variant="h2">Chat Room: {chatRoom.data.getChatRoom.id}</Typography>
    //         <ul>
    //             {messages.data.getMessagesByChatRoomId.map((message) => (
    //                 <Message key={message.id} message={message} />
    //             ))}
    //         </ul>
    //         <form onSubmit={(e) => handleSendMessage(e, currentUser.data.getCurrentUser.id, chatRoom.data.getChatRoom.id)}>
    //             <TextField
    //                 type="body"
    //                 label="New Message"
    //                 value={messageBody}
    //                 onChange={(e) => setMessageBody(e.target.value)}
    //             />
    //             <Button type="submit" variant="contained" color="primary">
    //                 Send Message
    //             </Button>
    //         </form>
    //     </div>
    // );
    return (
        <Container component={Paper} sx={{ height: '90vh', mt: 2, display: 'flex', flexDirection: 'column', p: 2 }}>
            <CssBaseline />
            <Typography variant="h2" sx={{ mb: 2 }}>Chat Room: {chatRoom.data.getChatRoom.id}</Typography>
            <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                <Stack>
                    {messages.data.getMessagesByChatRoomId.map((message) => (
                        <Message key={message.id} message={message} isCurrentUser={message.senderId === currentUser.data.getCurrentUser.id} />
                    ))}
                </Stack>
            </Box>
            <form onSubmit={(e) => handleSendMessage(e, currentUser.data.getCurrentUser.id, chatRoom.data.getChatRoom.id)}>
                <Stack direction="row" spacing={1}>
                    <TextField
                        type="body"
                        label="New Message"
                        fullWidth
                        value={messageBody}
                        onChange={(e) => setMessageBody(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Send Message
                    </Button>
                </Stack>
            </form>
        </Container>
    );
};

export default ChatRoomViewer;
