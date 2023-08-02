// hooks component
// Path: frontend\src\components\hooksHub.js
import { Box, Stack, Paper, TextField, Button, Typography, CssBaseline, Container, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import Loading from './Loading';
import Error from './Error';
import useMessageSender from '../hooks/mutations/useMessageSender';
import useGetMessagesByChatRoomId from '../hooks/queries/useGetMessagesByChatRoomId';
import useNewMessageSubscription from '../hooks/subscriptions/useNewMessageSubscription';
import { useTranslation } from "react-i18next";
import { Message } from './Message';
import { useGetChatRoomById } from '../hooks/queries/useGetChatRoomById';
import { useGetChatRoomUsers } from '../hooks/queries/useGetChatRoomUsers';
import { useGetCurrentUser } from '../hooks/queries/useGetCurrentUser';


const ChatRoomViewer = () => {

    const {t} = useTranslation();
    const { chatRoomId } = useParams();
    const useGetCurrentUserObject = useGetCurrentUser();
    const useGetChatRoomByIdObject = useGetChatRoomById(chatRoomId);
    const useGetChatRoomUsersObject = useGetChatRoomUsers(chatRoomId);
    const { messageBody, setMessageBody, handleSendMessage, sendMessageLoading, sendMessageError, setFile } = useMessageSender();
    const { messageData, messageLoading, messageError } = useGetMessagesByChatRoomId(chatRoomId);
    const { newMessageData } = useNewMessageSubscription();
    const [messages, setMessages] = useState([]);

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

    const isLoading = useGetChatRoomByIdObject.loading || messageLoading || useGetCurrentUserObject.loading || sendMessageLoading;

    if (isLoading) {
        return <Loading queryName="Loading" />;
    }

    if (useGetChatRoomByIdObject.error)  return <Error queryName="chatRoom" message={useGetChatRoomByIdObject.error.message} />;
    if (messageError)  return <Error queryName="messages" message={messageError.message} />;
    if (useGetCurrentUserObject.error)  return <Error queryName="currentUser" message={useGetCurrentUserObject.error.message} />;
    if (sendMessageError)  return <Error queryName="sendMessage" message={sendMessageError.message} />;

    return (
        <Container component={Paper} sx={{ height: '90vh', mt: 2, display: 'flex', flexDirection: 'column', p: 2 }}>
            <CssBaseline />
            <Typography variant="h2" sx={{ mb: 2 }}>{t('chatRoom')}: {useGetChatRoomByIdObject.data.getChatRoomById.id}</Typography>

            <Box sx={{ mb: 2 }}>
                <Typography variant="h5">{t('users')}</Typography>
                <List>
                    {useGetChatRoomUsersObject.data.getChatRoomUsers.map((user) => (
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
                        <Message key={message.id} message={message} isCurrentUser={message.senderId === useGetCurrentUserObject.data.getCurrentUser.id} />
                    ))}
                </Stack>
            </Box>

            <form onSubmit={(e) => handleSendMessage(
                e,
                useGetCurrentUserObject.data.getCurrentUser.id,
                useGetChatRoomByIdObject.data.getChatRoomById.id
            )}>
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
