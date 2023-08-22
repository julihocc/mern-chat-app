// frontend/src/components/ChatRoomViewer.js

// Importing necessary components, icons, and hooks
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
import React, { useEffect, useState } from "react"; // Importing React and hooks
import { useParams } from "react-router-dom"; // Importing useParams to get parameters from the URL
import PersonIcon from "@mui/icons-material/Person"; // Importing an icon to display with messages
import Loading from "./Loading"; // Importing a loading component to show while data is loading
import { useTranslation } from "react-i18next"; // Importing a hook to handle translations
import logger from "loglevel"; // Importing a logger for debugging
import { useDispatch, useSelector } from "react-redux"; // Importing Redux hooks
import { fetchMessages, fetchChatRoom } from "../redux/actions"; // Importing the necessary actions
import { sendMessage } from '../redux/slices/chatSlice'; // Importing the sendMessage action

import { useMutation } from "@apollo/client"; // Importing Apollo Client's mutation hook
import { SEND_MESSAGE } from "../gql/mutations/SEND_MESSAGE"; // Importing the GraphQL mutation to send messages

const ChatRoomViewer = () => {
  const { t } = useTranslation(); // Hook to handle translations
  const { chatRoomId } = useParams(); // Getting the chatRoomId from the URL
  const dispatch = useDispatch(); // Hook to dispatch Redux actions
  const chatRoom = useSelector((state) => state.chat.chatRoom); // Getting chatRoom data from the Redux store
  const messages = useSelector((state) => state.chat.messages); // Getting messages from the Redux store
  const currentUser = useSelector((state) => state.currentUser.user); // Getting the current user from the Redux store
  const isLoading = useSelector(
      (state) => state.chat.loading || state.currentUser.loading
  ); // Checking loading status
  const chatRoomError = useSelector((state) => state.chat.error); // Getting any chat room error from the Redux store

  const [messageBody, setMessageBody] = useState(""); // State to hold the message being typed
  const [file, setFile] = useState(null); // State to hold a file to be sent
  const [sendMessageMutation] = useMutation(SEND_MESSAGE); // Mutation to send messages
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn); // Getting the login status from the Redux store

  // Function to handle changes in the file input
  const handleFileChange = (e) => {
    const tempFile = e.target.files[0];
    const maxSize = 2097152; // 2MB
    if (tempFile.size > maxSize) {
        alert("File too large");
        return;
    }
    logger.debug("typeof tempFile: ", typeof tempFile);
    setFile(tempFile); // Setting the selected file
  };

  // Async function to handle sending messages
  const handleSendMessage = async (e, senderId, chatRoomId) => {
    e.preventDefault();

    let fileContent = null;

    if (file) {
      // Read file as a Base64 string if there's a file
      logger.debug("file: ", file);
      fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    // Executing the sendMessage mutation with necessary variables
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
          dispatch(sendMessage(res.data.sendMessage)); // Dispatching the sendMessage action with the response data
        })
        .catch((err) => {
          logger.error("err: ", err);
        });
  };

  // Using the useEffect hook to dispatch actions to fetch messages and chat room data when the component mounts
  useEffect(() => {
    dispatch(fetchMessages(chatRoomId));
    dispatch(fetchChatRoom(chatRoomId));
  }, [chatRoomId, dispatch]);

  // Rendering different UI based on loading status, errors, and login status
  if (!isLoggedIn) return <Typography variant="h4">Please log in to view the chat room</Typography>;
  if (isLoading) return <Loading queryName="Loading" />;
  if (chatRoomError) return <p>Chat Room Error: {JSON.stringify(chatRoomError)}</p>;

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
          {t("chatRoom")}: {chatRoom ? chatRoom.id : 'Loading...'} {/* Rendering chat room ID or loading message */}
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
                            message.senderId === currentUser.id ? "row-reverse" : "row", // Styling based on sender
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
                              message.senderId === currentUser.id ? "right" : "left", // Styling based on sender
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
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <TextField
              variant="outlined"
              fullWidth
              id="messageBody"
              label="Message"
              name="messageBody"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)} // Handling changes to the message input
          />
          <input
              type="file"
              name="file"
              id="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange} // Handling changes to the file input
          />
          <Button
              variant="contained"
              color="primary"
              onClick={(e) => handleSendMessage(e, currentUser.id, chatRoomId)} // Handling the click event for sending messages
          >
            {t("send")}
          </Button>
        </Stack>
      </Container>
  );
};

export default ChatRoomViewer;
