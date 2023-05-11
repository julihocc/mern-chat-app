import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from "react-router-dom";

const GET_CHAT_ROOMS = gql`
    query GetChatRooms {
        getChatRooms{
            id
            participantIds
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <li>
            <Link to={`/chat/${id}`}>{id}: </Link>
            <ul>
                {data.getUsersById.map((user) => (
                    <li key={user.id}>{user.email}</li>
                ))}
            </ul>
        </li>
    );
};

const ChatList = () => {
    const { loading, error, data } = useQuery(GET_CHAT_ROOMS, {
        fetchPolicy: 'network-only', // ignore cache
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h3>Chat List</h3>
            <ul>
                {data.getChatRooms.map(({ id, participantIds }) => (
                    <ChatRoom key={id} id={id} participantIds={participantIds} />
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
