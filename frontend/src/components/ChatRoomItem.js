
import {Alert, CircularProgress,  ListItem} from "@mui/material";
import logger from "../utils/logger";
import {Link} from "react-router-dom";
import React from "react";
// import {useGetUsersById} from "../hooks/queries/useGetUsersById";
import {useGetCurrentUser} from "../hooks/queries/useGetCurrentUser";

export const ChatRoomItem = ({ chatRoomId }) => {

    const { loading: loadingCurrentUser, error: errorCurrentUser } = useGetCurrentUser();


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
