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
import {useMutation, useSubscription} from "@apollo/client";
import {FILE_UPLOADED} from "../gql/subscriptions/FILE_UPLOADED";
import {UPLOAD_FILE_TO_S3} from "../gql/mutations/UPLOAD_FILE_TO_S3";
import gql from "graphql-tag";
import logger from "../utils/logger";

const SEND_MESSAGE = gql`
    mutation SendMessage(
        $senderId: ID!
        $chatRoomId: ID!
        $body: String
        $fileUrl: String
    ) {
        sendMessage(
            senderId: $senderId
            chatRoomId: $chatRoomId
            body: $body
            fileUrl: $fileUrl
        ) {
            id
            senderId
            chatRoomId
            body
            fileUrl
            createdAt
        }
    }
`;

const ChatRoomViewer = () => {
    const {t} = useTranslation();
    const {chatRoomId} = useParams();
    const currentUser = useGetCurrentUser();
    const chatRoom = useGetChatRoomById(chatRoomId);
    const {messageData, messageLoading, messageError} = useGetMessagesByChatRoomId(chatRoomId);
    const {newMessageData} = useNewMessageSubscription();
    const {data: fileUploadedData} = useSubscription(FILE_UPLOADED, {
        variables: {chatRoomId},
    });
    const [messageBody, setMessageBody] = useState("");
    const [file, setFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const currentUserId = currentUser.data?.getCurrentUser?.id;

    const [sendMessageMutation, {loading: sendMessageLoading, error: sendMessageError},] = useMutation(SEND_MESSAGE);

    const sendMessage = async (senderId, chatRoomId, messageBody, fileUrl) => {
        try {
            await sendMessageMutation({
                variables: {senderId, chatRoomId, body: messageBody, fileUrl},
            });

            setMessageBody("");
        } catch (err) {
            logger.error("sendMessage error: ", err);
        }
    };

    const [uploadFileToS3Mutation] = useMutation(UPLOAD_FILE_TO_S3, {
        onCompleted: (data) => {
            logger.info("uploadFileToS3Mutation onCompleted data:", data)
        }, onError: (err) => {
            logger.error("uploadFileToS3Mutation onError err:", err)
        }
    });

    const uploadFileToS3 = async (file, chatRoomId) => {
        try {
            console.log("Uploading file to S3:", {file, chatRoomId}); // Log the input values
            let fileUrl = null;
            if (file) {
                logger.info("file: ", file)
                const result = await uploadFileToS3Mutation({
                    variables: {file, chatRoomId},
                });
                logger.info("uploadFileToS3 result:", result); // Log the result for troubleshooting
                fileUrl = result.data.uploadFileToS3.fileUrl;
                logger.info("fileUrl: ", fileUrl)
            } else {
                logger.error("No file to upload")
            }
            return fileUrl;
        } catch (err) {
            logger.error("uploadFileToS3 error:", err); // Log the error for more details
        }
    };

    const isLoading = chatRoom.loading || messageLoading || currentUser.loading || sendMessageLoading;

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSendMessage = async (e, senderId, chatRoomId) => {
        e.preventDefault();
        const fileUrl = await uploadFileToS3(file, chatRoomId);
        if (messageBody.trim() !== "") {
            await sendMessage(senderId, chatRoomId, messageBody, fileUrl);
            setFile(null);
        }
    };

    useEffect(() => {
        setMessages(messageData?.getMessagesByChatRoomId);
    }, [messageData]);

    useEffect(() => {
        if (newMessageData?.newMessage) {
            setMessages((prev) => [...prev, newMessageData.newMessage]);
        }
    }, [newMessageData]);

    useEffect(() => {
        if (fileUploadedData?.fileUploaded) {
            // Handle the uploaded file URL as needed
        }
    }, [fileUploadedData]);

    if (!currentUserId) return (<Typography variant="h4">Please log in to view the chat room</Typography>);
    if (isLoading) return <Loading queryName="Loading"/>;

    if (chatRoom.error) return <p>Chat Room Error: {JSON.stringify(chatRoom.error)}</p>;
    if (messageError) return <p>Message Error: {JSON.stringify(messageError)}</p>;
    if (currentUser.error) return <p>Current User Error: {JSON.stringify(currentUser.error)}</p>;
    if (sendMessageError) return <p>Send Message Error: {JSON.stringify(sendMessageError)}</p>;

    return (<Container
            component={Paper}
            sx={{
                height: "90vh", mt: 2, display: "flex", flexDirection: "column", p: 2,
            }}
        >
            <CssBaseline/>
            <Typography variant="h2" sx={{mb: 2}}>
                {t("chatRoom")}: {chatRoom.data.getChatRoomById.id}
            </Typography>
            <Typography variant="h5" sx={{mb: 2}}>
                {t("messages")}
            </Typography>
            <List>
                {messages && messages.slice(-5).map((message, index) => (<ListItem
                        key={index}
                        sx={{
                            flexDirection: message.senderId === currentUserId ? "row-reverse" : "row",
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <PersonIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={message.body}
                            secondary={message.senderId}
                            sx={{
                                textAlign: message.senderId === currentUserId ? "right" : "left",
                            }}
                        />
                        {message.fileUrl && (<Button
                                variant="outlined"
                                color="primary"
                                component="a"
                                href={message.fileUrl}
                                download
                            >
                                Download File
                            </Button>)}
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
                        style={{display: "none"}}
                        id="inputForFile"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="inputForFile">
                        <Button variant="contained" component="span">
                            {file ? file.name : "Upload File"}
                        </Button>
                    </label>
                    <Button type="submit" variant="contained" color="primary">
                        {t("sendMessage")}
                    </Button>
                </Stack>
            </form>
        </Container>);
};

export default ChatRoomViewer;
