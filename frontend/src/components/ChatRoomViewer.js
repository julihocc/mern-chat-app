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
import { s3 } from "../s3";
import { useMutation } from "@apollo/react-hooks";
import { SEND_MESSAGE } from "../gql/mutations/SEND_MESSAGE";
import { gql } from "@apollo/client";
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
        setFile(e.target.files[0]);
    };

    // Log user and chat room data
    logger.info("Current user data:", currentUser);
    logger.info("Chat room data:", chatRoom);

    const uploadFileToS3 = (file) => {
        return new Promise((resolve, reject) => {
            const params = { Bucket: 'my-bucket', Key: file.name, Body: file };
            s3.upload(params, (err, data) => {
                if (err) {
                    logger.error("File upload error:", err); // Log the error
                    reject(err);
                } else {
                    resolve(data.Location);
                }
            });
        });
    };

    const sendMessage = async (senderId, chatRoomId, fileUrl) => {
        logger.info("Sending message:", { senderId, chatRoomId, body: messageBody, fileUrl }); // Log the message data
        try {
            await sendMessageMutation({ variables: { senderId, chatRoomId, body: messageBody, fileUrl } });
            setMessageBody("");
        } catch (err) {
            console.error("sendMessage error: ", err);
        }
    };

    const handleSendMessage = async (e, senderId, chatRoomId) => {
        e.preventDefault();
        let fileUrl = file ? await uploadFileToS3(file) : null;
        if (messageBody.trim() !== "") {
            await sendMessage(senderId, chatRoomId, fileUrl);
            setFile(null);
        }
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
                        {message.fileUrl && (
                            <Button variant="outlined" color="primary" component="a" href={message.fileUrl} download>Download File</Button>
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
