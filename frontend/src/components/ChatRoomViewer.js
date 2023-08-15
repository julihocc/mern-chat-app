// path: frontend/src/components/ChatRoomViewer.js
// Importing dependencies and components
import {
    Stack, Paper, TextField, Button, Typography,
    CssBaseline, Container, List, ListItem,
    ListItemAvatar, ListItemText, Avatar,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import Loading from "./Loading";
import useGetMessagesByChatRoomId from "../hooks/queries/useGetMessagesByChatRoomId";
import useNewMessageSubscription from "../hooks/subscriptions/useNewMessageSubscription";
import { useTranslation } from "react-i18next";
import { useGetChatRoomById } from "../hooks/queries/useGetChatRoomById";
import { useGetCurrentUser } from "../hooks/queries/useGetCurrentUser";
import logger from "loglevel";
import { useMutation } from "@apollo/react-hooks";
import { SEND_MESSAGE } from "../gql/mutations/SEND_MESSAGE";
import {GET_MESSAGES_BY_CHAT_ROOM_ID} from "../gql/queries/GET_MESSAGES_BY_CHAT_ROOM_ID";

const ChatRoomViewer = () => {
    const { t } = useTranslation();
    const { chatRoomId } = useParams();
    const currentUser = useGetCurrentUser();
    const chatRoom = useGetChatRoomById(chatRoomId);
    const { messageData, messageLoading, messageError } = useGetMessagesByChatRoomId(chatRoomId);
    const { newMessageData } = useNewMessageSubscription();
    const [messageBody, setMessageBody] = useState("");
    const [file, setFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const currentUserId = currentUser.data?.getCurrentUser?.id;

    const [sendMessageMutation, { loading: sendMessageLoading, error: sendMessageError }] = useMutation(SEND_MESSAGE, {
        refetchQueries: [
            { query: GET_MESSAGES_BY_CHAT_ROOM_ID, variables: { chatRoomId } }
        ],
        onCompleted: (data) => {
            logger.info("Message sent successfully:", data);
        },
        onError: (error) => {
            logger.error("Error sending message:", error);
        }
    });


    const isLoading = chatRoom.loading || messageLoading || currentUser.loading || sendMessageLoading;

    const handleFileChange = (e) => {
        const tempFile = e.target.files[0];
        logger.debug('typeof tempFile: ', typeof tempFile);
        setFile(tempFile);
    };

    // Log user and chat room data
    // logger.debug("Current user data:", currentUser);
    // logger.debug("Chat room data:", chatRoom);

    const handleSendMessage = async (e, senderId, chatRoomId) => {
        e.preventDefault();
        await sendMessageMutation({
            variables: {
                senderId: senderId,
                chatRoomId: chatRoomId,
                body: messageBody,
                file: file, // Including the file in the mutation
            }
        })
    };


    useEffect(() => {
        logger.info("Messages from server:", messageData?.getMessagesByChatRoomId); // Log messages
        setMessages(messageData?.getMessagesByChatRoomId);
    }, [messageData]);

    useEffect(() => {
        if (newMessageData?.newMessage) {
            logger.info("New message from subscription:", newMessageData.newMessage); // Log new message
            setMessages((prev) => [...prev, newMessageData.newMessage]);
        }
    }, [newMessageData]);

    if (!currentUserId) return <Typography variant="h4">Please log in to view the chat room</Typography>;
    if (isLoading) return <Loading queryName="Loading" />;

    if(chatRoom.error) return <p>Chat Room Error: {JSON.stringify(chatRoom.error)}</p>;
    if(messageError) return <p>Message Error: {JSON.stringify(messageError)}</p>;
    if(currentUser.error) return <p>Current User Error: {JSON.stringify(currentUser.error)}</p>;
    if(sendMessageError) return <p>Send Message Error: {JSON.stringify(sendMessageError)}</p>;

    return (
        <Container component={Paper} sx={{ height: "90vh", mt: 2, display: "flex", flexDirection: "column", p: 2 }}>
            <CssBaseline />
            <Typography variant="h2" sx={{ mb: 2 }}>{t("chatRoom")}: {chatRoom.data.getChatRoomById.id}</Typography>
            <Typography variant="h5" sx={{ mb: 2 }}>{t("messages")}</Typography>
            <List>
                {messages && messages.slice(-5).map((message, index) => (
                    <ListItem key={index} sx={{ flexDirection: message.senderId === currentUserId ? "row-reverse" : "row" }}>
                        <ListItemAvatar>
                            <Avatar><PersonIcon /></Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={message.body} secondary={message.senderId} sx={{ textAlign: message.senderId === currentUserId ? "right" : "left" }} />
                        {message.fileContent && (
                            // Assuming the file is an image, render it as an image tag
                            <img src={`data:${message.mimeType};base64,${message.fileContent}`} alt="Uploaded content" />
                            // For other file types, you can create a download link with the appropriate MIME type
                        )}
                    </ListItem>
                ))}
            </List>

            <form onSubmit={(e) => handleSendMessage(e, currentUserId, chatRoomId)}>
                <Stack direction="row" spacing={1}>
                    <TextField type="body" label={t("newMessage")} fullWidth value={messageBody} onChange={(e) => setMessageBody(e.target.value)} />
                    <input accept="image/*" style={{ display: 'none' }} id="inputForFile" type="file" onChange={handleFileChange} />
                    <label htmlFor="inputForFile"><Button variant="contained" component="span">{file ? file.name : 'Upload File'}</Button></label>
                    <Button type="submit" variant="contained" color="primary">{t("sendMessage")}</Button>
                </Stack>
            </form>
        </Container>
    );
};

export default ChatRoomViewer;
