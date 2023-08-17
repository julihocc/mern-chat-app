// frontend/src/components/ChatRoomViewer.js
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
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import Loading from "./Loading";
import { useTranslation } from "react-i18next";
import logger from "loglevel";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, fetchMessages, fetchChatRoom } from "../actions"; // Import the necessary actions

import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../gql/mutations/SEND_MESSAGE";

const ChatRoomViewer = () => {
  const { t } = useTranslation();
  const { chatRoomId } = useParams();
  const dispatch = useDispatch();
  const chatRoom = useSelector((state) => state.chat.chatRoom);
  // logger.debug('chatRoom: ', JSON.stringify(chatRoom));
  const messages = useSelector((state) => state.chat.messages);
  const currentUser = useSelector((state) => state.currentUser.user);
  const isLoading = useSelector(
    (state) => state.chat.loading || state.currentUser.loading
  );
  const chatRoomError = useSelector((state) => state.chat.error);

  const [messageBody, setMessageBody] = useState("");
  const [file, setFile] = useState(null);
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  // const currentUserId = currentUser.data?.getCurrentUser?.id;
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn); // Get the isLoggedIn flag from the user state

  const handleFileChange = (e) => {
    const tempFile = e.target.files[0];
    logger.debug("typeof tempFile: ", typeof tempFile);
    setFile(tempFile);
  };

  const handleSendMessage = async (e, senderId, chatRoomId) => {
    e.preventDefault();

    let fileContent = null;

    if (file) {
      // Read file as a Base64 string
      logger.debug("file: ", file);
      fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    sendMessageMutation({
      variables: {
        senderId: currentUser.id,
        chatRoomId: chatRoomId,
        body: messageBody,
        fileContent: fileContent,
      },
    })
      .then((res) => {
        logger.debug("fileContent: ", fileContent);
        logger.debug("res: ", res);
        dispatch(sendMessage(res.data.sendMessage));
      })
      .catch((err) => {
        logger.error("err: ", err);
      });
  };

  useEffect(() => {
    dispatch(fetchMessages(chatRoomId));
    dispatch(fetchChatRoom(chatRoomId));
  }, [chatRoomId, dispatch]);

  // if (!currentUserId) return <Typography variant="h4">Please log in to view the chat room</Typography>;
  if (!isLoggedIn)
    return (
      <Typography variant="h4">Please log in to view the chat room</Typography>
    ); // Check the isLoggedIn flag
  if (isLoading) return <Loading queryName="Loading" />;
  if (chatRoomError)
    return <p>Chat Room Error: {JSON.stringify(chatRoomError)}</p>;

  // if (messages) {
  //   return messages.map((message, index) => (
  //     <div>
  //       <p>
  //         {typeof message.fileContent}
  //         {JSON.stringify(message.fileContent)}
  //       </p>
  //       <img
  //         src={`data:${message.mimeType};base64,${message.fileContent}`}
  //         alt="Uploaded content"
  //       />
  //     </div>
  //   ));
  // }
  // undefined

  return (
    <Container
      component={Paper}
      sx={{
        height: "90vh",
        mt: 2,
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <CssBaseline />
      <Typography variant="h2" sx={{ mb: 2 }}>
        {t("chatRoom")}: {chatRoom.id}
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t("messages")}
      </Typography>
      <List>
        {messages &&
          messages.slice(-5).map((message, index) => (
            <ListItem
              key={index}
              sx={{
                flexDirection:
                  message.senderId === currentUser.id ? "row-reverse" : "row",
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={message.body}
                secondary={message.senderId}
                sx={{
                  textAlign:
                    message.senderId === currentUser.id ? "right" : "left",
                }}
              />
              {message.fileContent && (
                <img
                  src={`${message.fileContent}`}
                  alt="Uploaded content"
                />
              )}
            </ListItem>
          ))}
      </List>
      <form onSubmit={(e) => handleSendMessage(e, currentUser.id, chatRoomId)}>
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
            style={{ display: "none" }}
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
    </Container>
  );
};

export default ChatRoomViewer;
