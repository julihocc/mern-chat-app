
import {CircularProgress, ListItem} from "@mui/material";
import logger from "../utils/logger";
import {Link} from "react-router-dom";
import React from "react";
import {useGetCurrentUser} from "../hooks/queries/useGetCurrentUser";
import {useGetChatRoomById} from "../hooks/queries/useGetChatRoomById";

export const ChatRoomItem = ({ chatRoomId }) => {

    const { loading: loadingCurrentUser, error: errorCurrentUser, data: dataCurrentUser } = useGetCurrentUser();
    const { loading, error, data } = useGetChatRoomById(chatRoomId)

    if (loadingCurrentUser) return <CircularProgress />;
    if (errorCurrentUser) {
        logger.error(`Error when trying to get current user: ${errorCurrentUser.message}`);  // using logger
        return <p>Error: {errorCurrentUser.message}</p>;
    }


    const users = data?.getChatRoomById.participantIds || []

    return (
        <ListItem>
            <Link to={`/chat/${chatRoomId}`}> Chat ID: {chatRoomId}
                {/* <List>
                    {users.map((user) => (
                        <ListItem key={user}>
                            {user}
                        </ListItem>
                    ))}
                </List> */}
            </Link>
        </ListItem>
    );
};
