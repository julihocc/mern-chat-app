import {Alert, CircularProgress, ListItem} from "@mui/material";
import logger from "../utils/logger";
import {Link} from "react-router-dom";
import React from "react";
import {useGetCurrentUser} from "../hooks/queries/useGetCurrentUser";

export const ChatRoomItem = ({chatRoomId, participantIds}) => {
	logger.debug(`Rendering ChatRoomItem for chatRoomId: ${chatRoomId}`);
	logger.debug(`Rendering ChatRoomItem for participantIds: ${participantIds}`);
	const {
		loading: loadingCurrentUser, error: errorCurrentUser, data: dataCurrentUser,
	} = useGetCurrentUser();


	if (loadingCurrentUser) return <CircularProgress/>;
	if (errorCurrentUser) {
		logger.error(`Error when trying to get current user: ${errorCurrentUser.message}`,);
		return <Alert severity="error">Error: {errorCurrentUser.message}</Alert>;
	}

	return (<ListItem>
			<Link to={`/chat/${chatRoomId}`}>
				{" "}
				Chat ID: {chatRoomId}
			</Link>
		</ListItem>);
};
