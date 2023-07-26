// ChatRoomViewer component
// Path: frontend\src\components\ChatRoomViewer.js
import { Box, Stack, Paper, TextField, Button, Typography, CssBaseline, Container, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useSubscription, gql, useQuery } from '@apollo/client';
import PersonIcon from '@mui/icons-material/Person';
import Loading from './ChatRoomViewer/Loading';
import Error from './ChatRoomViewer/Error';
import useChatRoomQuery from './ChatRoomViewer/useChatRoomQuery';
import useMessageSender from './ChatRoomViewer/useMessageSender';
import { useTranslation } from "react-i18next";

const NEW_MESSAGE_SUBSCRIPTION = gql`
    subscription OnNewMessage($chatRoomId: ID!) {
        newMessage(chatRoomId: $chatRoomId) {
            id
            body
            senderId
        }
    }
`;

const GET_MESSAGES_BY_CHATROOM_ID = gql`
    query GetMessagesByChatRoomId($chatRoomId: ID!) {
        getMessagesByChatRoomId(chatRoomId: $chatRoomId) {
            id
            body
            senderId
        }
    }
`;

const GET_USER_BY_ID = gql`
    query GetUserById($userId: ID!) {
        getUserById(userId: $userId) {
            id
            email
        }
    }
`;

const GET_USERS_BY_IDS = gql`
    query GetUsersById($userIds: [ID!]!) {
        getUsersById(userIds: $userIds) {
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
    const {t} = useTranslation();
    const { id } = useParams();
    const { chatRoom, currentUser } = useChatRoomQuery(id);
    // const { messageBody, setMessageBody, handleSendMessage, sendMessageLoading, sendMessageError } = useMessageSender();
    // Note: Destructuring file and setFile from useMessageSender
    const { messageBody, setMessageBody, handleSendMessage, sendMessageLoading, sendMessageError, file, setFile } = useMessageSender();

    const [messages, setMessages] = useState([]);

    // Removed: const [selectedFile, setSelectedFile] = useState(null);

    const { data: newMessageData } = useSubscription(NEW_MESSAGE_SUBSCRIPTION, {
        variables: { chatRoomId: id },
    });

    const { data: messageData, loading: messageLoading, error: messageError } = useQuery(GET_MESSAGES_BY_CHATROOM_ID, {
        variables: { chatRoomId: id },
    });

    const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS_BY_IDS, {
        variables: { userIds: chatRoom.data?.getChatRoom?.participantIds },
        skip: chatRoom.loading || chatRoom.error,
    });

    useEffect(() => {
        if (messageData?.getMessagesByChatRoomId) {
            setMessages(messageData.getMessagesByChatRoomId);
        }
    }, [messageData]);

    useEffect(() => {
        if (newMessageData?.newMessage) {
            setMessages((prev) => [...prev, newMessageData.newMessage]);
        }
    }, [newMessageData]);

    const isLoading = chatRoom.loading || messageLoading || currentUser.loading || sendMessageLoading;

    if (isLoading) {
        return <Loading queryName="Loading" />;
    }

    if (chatRoom.error)  return <Error queryName="chatRoom" message={chatRoom.error.message} />;
    if (messageError)  return <Error queryName="messages" message={messageError.message} />;
    if (currentUser.error)  return <Error queryName="currentUser" message={currentUser.error.message} />;
    if (sendMessageError)  return <Error queryName="sendMessage" message={sendMessageError.message} />;

    return (
        <Container component={Paper} sx={{ height: '90vh', mt: 2, display: 'flex', flexDirection: 'column', p: 2 }}>
            <CssBaseline />
            <Typography variant="h2" sx={{ mb: 2 }}>{t('chatRoom')}: {chatRoom.data.getChatRoom.id}</Typography>

            <Box sx={{ mb: 2 }}>
                <Typography variant="h5">{t('users')}</Typography>
                <List>
                    {usersData?.getUsersById.map((user) => (
                        <ListItem key={user.id}>
                            <ListItemAvatar>
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={user.email} />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                <Stack>
                    {messages.map((message) => (
                        <Message key={message.id} message={message} isCurrentUser={message.senderId === currentUser.data.getCurrentUser.id} />
                    ))}
                </Stack>
            </Box>

            <form onSubmit={(e) => handleSendMessage(e, currentUser.data.getCurrentUser.id, chatRoom.data.getChatRoom.id)}>
                <Stack direction="row" spacing={1}>
                    <TextField
                        type="body"
                        label={t('newMessage')}
                        fullWidth
                        value={messageBody}
                        onChange={(e) => setMessageBody(e.target.value)}
                    />
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    <Button type="submit" variant="contained" color="primary">
                        {t('sendMessage')}
                    </Button>
                </Stack>
            </form>
        </Container>
    );
};

export default ChatRoomViewer;
