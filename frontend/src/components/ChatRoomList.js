// path: frontend/src/components/ChatRoomList.js
import React from 'react';
import {CircularProgress, List, ListItem, Typography} from "@mui/material";
import { useTranslation } from "react-i18next";
import log from '../utils/logger';  // importing the logger
import { useGetChatRooms } from "../hooks/queries/useGetChatRooms";
import {Link} from "react-router-dom";

const ChatRoomList = () => {
    const {t} = useTranslation();
    const { loading, error, data } = useGetChatRooms();  // using the hook
    if (loading) return <CircularProgress />;
    if (error) {
        log.error(`Error when trying to get chat rooms: ${error.message}`);  // using logger
        return <p>Error: {error.message}</p>;
    }
    if (!data) return <p>No data</p>;

    return (
        <div>
            <Typography variant="h4">{t('chatList')}</Typography>
            {
                data.getChatRooms.map((chatRoom) => (
                    <p>
                        <Link to={`/chat/${chatRoom._id}`}> Chat ID: {chatRoom._id} </Link>
                    </p>
                ))
            }
        </div>
    );
};

export default ChatRoomList;
