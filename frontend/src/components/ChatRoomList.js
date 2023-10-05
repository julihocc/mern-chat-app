// path: frontend/src/components/ChatRoomList.js
import React, {useState} from 'react';
import { CircularProgress, Alert, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import logger from '../utils/logger';  // importing the logger
import { useGetChatRoomsForCurrentUser } from "../hooks/queries/useGetChatRoomsForCurrentUser";
import {Link} from "react-router-dom";




const ChatRoomList = () => {
    const {t} = useTranslation();

    const [sortOption, setSortOption] = useState('ascending'); // default to date

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const { loading, error, data } = useGetChatRoomsForCurrentUser();
    if (loading) return <CircularProgress />;
    if (error) {
        logger.error(`Error when trying to get chat rooms: ${error.message}`);
        return <Alert severity="error">Error: {error.message}</Alert>;
    }
    logger.debug(`Data found: ${JSON.stringify(data)}`);  //

    let sortedChatRooms = [...data.getChatRoomsForCurrentUser];

    if (sortOption === 'ascending') {
        sortedChatRooms.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    } else if (sortOption === 'descending') {
        sortedChatRooms.sort(
            (a, b) =>  new Date(a.createdAt) - new Date(b.createdAt)
        );
    }

    // using logger
    return (
        <div>
            <Typography variant="h3">
                {t('chatList')}
            </Typography>
            <select onChange={handleSortChange}>
                <option value="date">Ascending</option>
                <option value="name">Descending</option>
            </select>
            {/*<ul>*/}
            {/*{data.getChatRoomsForCurrentUser.map((chatRoom) => (*/}
            {/*    <li key={chatRoom.id}>*/}
            {/*    <Link to={`/chat/${chatRoom.id}`} key={chatRoom.id}>*/}
            {/*        Chat: {Date(chatRoom.createdAt)}*/}
            {/*    </Link>*/}
            {/*    </li>*/}
            {/*))}*/}
            {/*</ul>*/}
            <ul>
                {sortedChatRooms.map((chatRoom) => (
                    <li key={chatRoom.id}>
                        <Link to={`/chat/${chatRoom.id}`}>
                            Chat: {chatRoom.createdAt}
                        </Link>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default ChatRoomList;
