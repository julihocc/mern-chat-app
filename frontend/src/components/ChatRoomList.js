// path: frontend/src/components/ChatRoomList.js
import React, {useState, useEffect} from 'react';
import { CircularProgress, Alert, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import logger from '../utils/logger';  // importing the logger
import { useGetChatRoomsForCurrentUser } from "../hooks/queries/useGetChatRoomsForCurrentUser";
import {Link} from "react-router-dom";

const ChatRoomList = () => {
    const {t} = useTranslation();

    const { loading, error, data } = useGetChatRoomsForCurrentUser();
    const [sortOption, setSortOption] = useState('ascending');
    const [sortedChatRooms, setSortedChatRooms] = useState([]);
    useEffect(() => {

        let sorted;

        if(data) {
            sorted = [...data.getChatRoomsForCurrentUser];
            logger.debug(`Sorted Chatrooms: ${ data.getChatRoomsForCurrentUser.map((chatRoom) => (chatRoom.createdAt))}`);
        } else {
            sorted = [];
        }

        if (sortOption === 'ascending') {
            sorted.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
        } else if (sortOption === 'descending') {
            sorted.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        }

        setSortedChatRooms(sorted);
    }, [sortOption, data]);

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        logger.debug(`Sort option changed to: ${event.target.value}`)
    };
    if (loading) return <CircularProgress />;
    if (error) {
        logger.error(`Error when trying to get chat rooms: ${error.message}`);
        return <Alert severity="error">Error: {error.message}</Alert>;
    }

    // let sortedChatRooms = [...data.getChatRoomsForCurrentUser];

    // if (sortOption === 'ascending') {
    //     sortedChatRooms.sort(
    //         (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    //     );
    // } else if (sortOption === 'descending') {
    //     sortedChatRooms.sort(
    //         (a, b) =>  new Date(b.createdAt) - new Date(a.createdAt)
    //     );
    // }



    // using logger
    return (
        <div>
            <Typography variant="h3">
                {t('chatList')}
            </Typography>
            <select onChange={handleSortChange}>
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
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

            <div key={sortOption}>
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

        </div>
    );
};

export default ChatRoomList;
