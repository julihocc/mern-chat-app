
import {Alert, CircularProgress, List, ListItem} from "@mui/material";
import logger from "../utils/logger";
import {Link} from "react-router-dom";
import React from "react";
// import {useGetUsersById} from "../hooks/queries/useGetUsersById";
import {useGetCurrentUser} from "../hooks/queries/useGetCurrentUser";

export const ChatRoomItem = ({ chatRoomId, participantIds }) => {
    logger.debug(`Rendering ChatRoomItem for chatRoomId: ${chatRoomId}`);  // using logger
    logger.debug(`Rendering ChatRoomItem for participantIds: ${participantIds}`);  // using logger
    // const { loading, error, data } = useGetUsersById({ userIds: participantIds });
    const { loading: loadingCurrentUser, error: errorCurrentUser, data: dataCurrentUser } = useGetCurrentUser();

    // if (loading) return <CircularProgress />;
    // if (error) {
    //     logger.error(`Error when trying to get users by id: ${error.message}`);  // using logger
    //     return <Alert severity="error">Error: {error.message}</Alert>;
    // }

    if (loadingCurrentUser) return <CircularProgress />;
    if (errorCurrentUser) {
        logger.error(`Error when trying to get current user: ${errorCurrentUser.message}`);  // using logger
        return <Alert severity="error">Error: {errorCurrentUser.message}</Alert>;
    }



    return (
        <ListItem>
            <Link to={`/chat/${chatRoomId}`}> Chat ID: {chatRoomId}
                {/*<List>*/}
                    {/*{data.getUsersById.map((user) => (*/}
                    {/*    <ListItem key={user.id}>*/}
                    {/*        {user.id === dataCurrentUser.getCurrentUser.id ? 'You' : user.username}*/}
                    {/*    </ListItem>*/}
                    {/*))}*/}
                {/*</List>*/}
            </Link>

        </ListItem>
    );
};
