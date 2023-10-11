// path: frontend/src/components/ChatRoomViewer.js
// Importing dependencies and components
import {
    Alert,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Loading from "./Loading";
import useGetMessagesByChatRoomId from "../hooks/queries/useGetMessagesByChatRoomId";
import useNewMessageSubscription from "../hooks/subscriptions/useNewMessageSubscription";
import {useTranslation} from "react-i18next";
import {useGetChatRoomById} from "../hooks/queries/useGetChatRoomById";
import {useMutation} from "@apollo/react-hooks";
import {SEND_MESSAGE} from "../gql/mutations/SEND_MESSAGE";
import {GET_MESSAGES_BY_CHATROOM_ID} from "../gql/queries/GET_MESSAGES_BY_CHATROOM_ID";
import {useDispatch, useSelector} from 'react-redux';
import {initiateFetchCurrentUser} from '../redux/actions';
import logger from "../utils/logger";
import {Gravatar} from './Gravatar';

const ChatRoomViewer = () => {
    const {t} = useTranslation();
    const {chatRoomId} = useParams();
    const chatRoom = useGetChatRoomById(chatRoomId);
    const {messageData, messageLoading, messageError} = useGetMessagesByChatRoomId(chatRoomId);
    const {newMessageData} = useNewMessageSubscription();
    const [messageBody, setMessageBody] = useState("");
    const [file, setFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [sendMessageMutation, {loading: sendMessageLoading, error: sendMessageError}] = useMutation(SEND_MESSAGE, {
        refetchQueries: [{query: GET_MESSAGES_BY_CHATROOM_ID, variables: {chatRoomId}}], onCompleted: (data) => {
            logger.debug("Message sent successfully:", data);
        }, onError: (error) => {
            logger.error("Error sending message:", error);
        }
    });

    const isLoading = chatRoom.loading || messageLoading || sendMessageLoading;

    const handleFileChange = (e) => {
        const tempFile = e.target.files[0];
        logger.debug('typeof tempFile: ', typeof tempFile);
        setFile(tempFile);
    };

    const handleSendMessage = async (e, senderId, chatRoomId) => {
        e.preventDefault();
        await sendMessageMutation({
            variables: {
                chatRoomId: chatRoomId, body: messageBody, file: file,
            }
        })
    };

    useEffect(() => {
        logger.debug("Messages from server:", messageData?.getMessagesByChatRoomId);
        setMessages(messageData?.getMessagesByChatRoomId);
    }, [messageData]);

    useEffect(() => {
        if (newMessageData?.newMessage) {
            logger.debug("New message from subscription:", newMessageData.newMessage);
            setMessages((prev) => [...prev, newMessageData.newMessage]);
        }
    }, [newMessageData]);

    // const currentUser = useGetCurrentUser();
    // =======================================
    const dispatch = useDispatch();

    // Extracting relevant pieces of the state
    const {loading, user, error, isLoggedIn} = useSelector((state) => state.user);

    // Fetch current user details if logged in
    useEffect(() => {
        if (isLoggedIn) {
            // Use the new action creator
            dispatch(initiateFetchCurrentUser());
        }
    }, [dispatch, isLoggedIn]);

    // Show a loader while the request is in progress
    if (loading) return <CircularProgress/>;

    // Handle error by showing an alert and logging it
    if (error) {
        logger.error(`GET_CURRENT_USER Error: ${error}`);
        return <Alert severity="error">{t('An error occurred')}</Alert>;
    }

    // Handle case when user data is unavailable but is supposed to be logged in
    if (isLoggedIn && !user) {
        return <div>Loading user data...</div>; // This could also be a spinner
    }

    // Handle case when user data is unavailable and not logged in
    if (!isLoggedIn) {
        return <div>Please log in.</div>;
    }
    // =======================================

    const currentUserId = user.id;

    if (!currentUserId) return <Typography variant="h4">Please log in to view the chat room</Typography>;
    if (isLoading) return <Loading queryName="Loading"/>;

    if (chatRoom.error) return <p>Chat Room Error: {JSON.stringify(chatRoom.error)}</p>;
    if (messageError) return <p>Message Error: {JSON.stringify(messageError)}</p>;
    if (sendMessageError) return <p>Send Message Error: {JSON.stringify(sendMessageError)}</p>;

    return (<Container component={Paper} sx={{height: "90vh", mt: 2, display: "flex", flexDirection: "column", p: 2}}>
        <CssBaseline/>
        <Typography variant="h2" sx={{mb: 2}}>
            {t("messages")}
        </Typography>
        <Typography variant="h3" sx={{mb: 2}}>
            {t("chatRoom")}: {Date(Number(chatRoom.data.getChatRoomById.createdAt))}
        </Typography>
        <Typography variant="h4" sx={{mb: 2}}>
            {t("participants")}: {chatRoom.data.getChatRoomById.participantIds.map((participant) => participant.username).join(", ")}
        </Typography>
        <List>
            {messages && messages
                .slice(-5)
                .map((message, index) => (<ListItem key={index}
                                                    sx={{flexDirection: message.senderId.id === currentUserId ? "row-reverse" : "row"}}>
                    <ListItemAvatar>
                        <Gravatar email={message.senderId.email}/>
                    </ListItemAvatar>
                    <ListItemText primary={message.body} secondary={message.senderId.username}
                                  sx={{textAlign: message.senderId.id === currentUserId ? "right" : "left"}}/>
                    {message.fileContent && (// Assuming the file is an image, render it as an image tag
                        <img src={`data:${message.mimeType};base64,${message.fileContent}`} alt="Uploaded content"/>
                        // For other file types, you can create a download link with the appropriate MIME type
                    )}
                </ListItem>))}
        </List>
        <form onSubmit={(e) => handleSendMessage(e, currentUserId, chatRoomId)}>
            <Stack direction="row" spacing={1}>
                <TextField type="body" label={t("newMessage")} fullWidth value={messageBody}
                           onChange={(e) => setMessageBody(e.target.value)}/>
                <input accept="image/*" style={{display: 'none'}} id="inputForFile" type="file"
                       onChange={handleFileChange}/>
                <label htmlFor="inputForFile"><Button variant="contained"
                                                      component="span">{file ? file.name : 'Upload File'}</Button></label>
                <Button type="submit" variant="contained" color="primary">{t("sendMessage")}</Button>
            </Stack>
        </form>
    </Container>);
};

export default ChatRoomViewer;
