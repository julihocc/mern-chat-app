// path: frontend/src/components/ChatRoomViewer.js
// Importing dependencies and components
import {
    Avatar,
    Button,
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
import PersonIcon from "@mui/icons-material/Person";
import Loading from "./Loading";
import useGetMessagesByChatRoomId from "../hooks/queries/useGetMessagesByChatRoomId";
import useNewMessageSubscription from "../hooks/subscriptions/useNewMessageSubscription";
import {useTranslation} from "react-i18next";
import {useGetChatRoomById} from "../hooks/queries/useGetChatRoomById";
import {useGetCurrentUser} from "../hooks/queries/useGetCurrentUser";
import logger from "loglevel";
import {useMutation} from "@apollo/react-hooks";
import {SEND_MESSAGE} from "../gql/mutations/SEND_MESSAGE";
import {GET_MESSAGES_BY_CHAT_ROOM_ID} from "../gql/queries/GET_MESSAGES_BY_CHAT_ROOM_ID";

const ChatRoomViewer = () => {
    const {t} = useTranslation();
    const {chatRoomId} = useParams();
    const currentUser = useGetCurrentUser();
    const chatRoom = useGetChatRoomById(chatRoomId);
    const {messageData, messageLoading, messageError} = useGetMessagesByChatRoomId(chatRoomId);
    const {newMessageData} = useNewMessageSubscription();
    const [messageBody, setMessageBody] = useState("");
    const [fileToUpload, setFileToUpload] = useState(null);
    const [messages, setMessages] = useState([]);
    const currentUserId = currentUser.data?.getCurrentUser?.id;

    const [sendMessageMutation, {loading: sendMessageLoading, error: sendMessageError}] = useMutation(SEND_MESSAGE, {
        refetchQueries: [{query: GET_MESSAGES_BY_CHAT_ROOM_ID, variables: {chatRoomId}}]
    });

    const isLoading = chatRoom.loading || messageLoading || currentUser.loading || sendMessageLoading;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        logger.debug("handleFileChange: ", file.name, file.size, file.type);

        // if (!file.type.startsWith("image/")) { // Make sure the uploaded file is an image
        //     logger.error("File upload error: Invalid file type");
        //     // You might want to notify the user that only images are allowed
        //     return;
        // } else {
        //     logger.debug("File upload: Valid file type");
        // }

        try {
            setFileToUpload(file);
        } catch (err) {
            logger.error("handleFileChange error: ", err);
            throw Error("File upload error. Make sure you are uploading an image." + err);
        }
    };

    const setAndSendMessage = async (senderId, chatRoomId) => {
        logger.debug("Sending message:", senderId, chatRoomId, fileToUpload ? fileToUpload.name : null);
        const variables = {
            senderId,
            chatRoomId,
            body: messageBody || ""
        };

        if (fileToUpload) {
            // Verify the content of fileToUpload
            logger.debug("fileToUpload:", fileToUpload);
            variables.fileToUpload = fileToUpload;
        }

        try {
            const retrievedMessage = await sendMessageMutation({ variables });
            logger.debug("Message sent successfully:", retrievedMessage);
        } catch (err) {
            logger.error("setAndSendMessage error:", err);
        }
    };


    const handleSendMessage = async (e, senderId, chatRoomId) => {
        e.preventDefault();
        if (fileToUpload || messageBody.trim() !== "") { // Marked change
            logger.debug("handleSendMessage: ", senderId, chatRoomId, fileToUpload ? fileToUpload.name : null);
            await setAndSendMessage(senderId, chatRoomId);
            setFileToUpload(null); // Reset the file to upload
        }
    };

    useEffect(() => {
        setMessages(messageData?.getMessagesByChatRoomId);
    }, [messageData]);

    useEffect(() => {
        if (newMessageData?.newMessage) {
            logger.debug("New message from subscription:", newMessageData.newMessage);
            setMessages((prev) => [...prev, newMessageData.newMessage]);
        }
    }, [newMessageData]);

    if (!currentUserId) return <Typography variant="h4">Please log in to view the chat room</Typography>;
    if (isLoading) return <Loading queryName="Loading"/>;

    if (chatRoom.error) return <p>Chat Room Error: {JSON.stringify(chatRoom.error)}</p>;
    if (messageError) return <p>Message Error: {JSON.stringify(messageError)}</p>;
    if (currentUser.error) return <p>Current User Error: {JSON.stringify(currentUser.error)}</p>;
    if (sendMessageError) return <p>Send Message Error: {JSON.stringify(sendMessageError)}</p>;

    return (<Container component={Paper} sx={{height: "90vh", mt: 2, display: "flex", flexDirection: "column", p: 2}}>
        <CssBaseline/>
        <Typography variant="h2" sx={{mb: 2}}>{t("chatRoom")}: {chatRoom.data.getChatRoomById.id}</Typography>
        <Typography variant="h5" sx={{mb: 2}}>{t("messages")}</Typography>
        <List>
            {messages && messages.slice(-5).map((message, index) => (<ListItem key={index}
                                                                               sx={{flexDirection: message.senderId === currentUserId ? "row-reverse" : "row"}}
            >
                <ListItemAvatar>
                    <Avatar>
                        <PersonIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={message.body}
                    secondary={message.senderId}
                    sx={{textAlign: message.senderId === currentUserId ? "right" : "left"}}
                />
                {message.fileUrl && (
                    <Button variant="outlined" color="primary" component="a" href={message.fileUrl} download>Download
                        File</Button>)}
            </ListItem>))}
        </List>
        <form onSubmit={(e) => handleSendMessage(e, currentUserId, chatRoomId)}>
            <Stack direction="row" spacing={1}>
                <TextField
                    type="body"
                    label={t("newMessage")}
                    fullWidth
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                />
                <input
                    accept="image/*"
                    style={{display: 'none'}}
                    id="inputForFile"
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="inputForFile">
                    <Button
                        variant="contained"
                        component="span"
                    >
                        {fileToUpload ? fileToUpload.name : 'Upload File'}
                    </Button>
                </label>
                <Button type="submit" variant="contained" color="primary">{t("send")}</Button>
            </Stack>
        </form>
    </Container>);
};

export default ChatRoomViewer;
