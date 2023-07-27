// Path: frontend\src\components\dashboardUtils\ChatList.js
import React from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';  // updated the import from '@apollo/react-hooks' to '@apollo/client'
import { Link } from "react-router-dom";
import { CircularProgress, Alert, List, ListItem, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import log from '../utils/logger';  // importing the logger

const GET_CHAT_ROOMS = gql`
    query GetChatRooms {
        getChatRooms{
            id
            participantIds
            messageIds
        }
    }
`;

const GET_USERS_BY_ID = gql`
    query GetUsersById($userIds: [ID!]!) {
        getUsersById(userIds: $userIds) {
            id
            email
        }
    }
`;

const ChatRoom = ({ id, participantIds }) => {
    const { loading, error, data } = useQuery(GET_USERS_BY_ID, {
        variables: { userIds: participantIds },
    });

    if (loading) return <CircularProgress />;
    if (error) {
        log.error(`Error when trying to get users by id: ${error.message}`);  // using logger
        return <Alert severity="error">Error: {error.message}</Alert>;
    }

    return (
        <ListItem>
            <Link to={`/chat/${id}`}>{id}: </Link>
            <List>
                {data.getUsersById.map((user) => (
                    <ListItem key={user.id}>{user.email}</ListItem>
                ))}
            </List>
        </ListItem>
    );
};

const ChatList = () => {
    const {t} = useTranslation();
    const { loading, error, data } = useQuery(GET_CHAT_ROOMS, {
        fetchPolicy: 'network-only', // ignore cache
    });

    if (loading) return <CircularProgress />;
    if (error) {
        log.error(`Error when trying to get chat rooms: ${error.message}`);  // using logger
        return <Alert severity="error">Error: {error.message}</Alert>;
    }


    return (
        <div>
            <Typography variant="h3">{t('chatList')}</Typography>
            <List>
                {data.getChatRooms.map(({ id, participantIds }) => (
                    <ChatRoom key={id} id={id} participantIds={participantIds} />
                ))}
            </List>
        </div>
    );
};

export default ChatList;
