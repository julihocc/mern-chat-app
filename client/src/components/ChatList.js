import React from 'react';
import { useQuery, gql } from '@apollo/client';
import {Link} from "react-router-dom";

const GET_CHAT_ROOMS = gql`
 query GetChatRooms {
     getChatRooms{
            id
     }
 }`

const ChatList = () => {
    const { loading, error, data } = useQuery(GET_CHAT_ROOMS, {
        fetchPolicy: 'network-only', // ignore cache
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>GET_CHAT_ROOMS Error : {error.message} </p>;

    return (
        <div>
            <h3> Chat List </h3>
            <ul>
                {data.getChatRooms.map(({ id }) => (
                    <li key={id}>
                        <Link to={`/chat/${id}`}>{id}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ChatList;