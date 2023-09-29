// path: frontend/src/components/ChatRoomList.js
import React from 'react';
import { CircularProgress, Alert, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import logger from '../utils/logger';  // importing the logger
import { useGetChatRoomsForCurrentUser } from "../hooks/queries/useGetChatRoomsForCurrentUser";
import {Link} from "react-router-dom";

const ChatRoomList = () => {
    const {t} = useTranslation();
    const { loading, error, data } = useGetChatRoomsForCurrentUser();  // using the hook
    if (loading) return <CircularProgress />;
    if (error) {
        logger.error(`Error when trying to get chat rooms: ${error.message}`);  // using logger
        return <Alert severity="error">Error: {error.message}</Alert>;
    }
    logger.debug(`Data found: ${JSON.stringify(data)}`);  // using logger
    return (
        <div>
            <Typography variant="h3">{t('chatList')}</Typography>
            <ul>
            {data.getChatRoomsForCurrentUser.map((chatRoom) => (
                <li key={chatRoom.id}>
                <Link to={`/chat/${chatRoom.id}`} key={chatRoom.id}>
                    Chat: {Date(Number(chatRoom.createdAt))}
                </Link>
                </li>
            ))}
            </ul>
        </div>
    );
};

export default ChatRoomList;
