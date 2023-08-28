// path: frontend/src/components/ChatRoomList.js
import React from 'react';
import { CircularProgress, List, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import log from '../utils/logger';  // importing the logger
import { useGetChatRoomsForCurrentUser } from "../hooks/queries/useGetChatRoomsForCurrentUser";
import { ChatRoomItem } from "./ChatRoomItem";

const ChatRoomList = () => {
    const {t} = useTranslation();
    const { loading, error, data } = useGetChatRoomsForCurrentUser();  // using the hook
    if (loading) return <CircularProgress />;
    if (error) {
        log.error(`Error when trying to get chat rooms: ${error.message}`);  // using logger
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            <Typography variant="h4">{t('chatList')}</Typography>
            <List>
                {data.getChatRoomsForCurrentUser.map(({ id, participantIds }) => (
                    <ChatRoomItem key={id} chatRoomId={id} participantIds={participantIds} />
                ))}
            </List>
        </div>
    );
};

export default ChatRoomList;
