import {useQuery} from "@apollo/client";
import {GET_USER_BY_ID} from "../gql/queries/GET_USER_BY_ID";
import {Box, Typography} from "@mui/material";
import React from "react";
import {useGetSender} from "../hooks/queries/useGetSender";

export const Message = ({message, isCurrentUser}) => {

	const {loading, error, data} = useGetSender(message)

	if (loading) return <p>Loading sender info...</p>;
	if (error) return <p>GET_USER)BY_ID Error: {error.message}</p>;

	return (
		<Box
			sx={{
				mb: 1,
				p: 1,
				backgroundColor: isCurrentUser ? "primary.light" : "grey.300",
				color: isCurrentUser ? "primary.contrastText" : "grey.900",
				alignSelf: isCurrentUser ? "flex-end" : "flex-start",
			}}
		>
			<Typography variant="subtitle2">{data.getUserById.email}</Typography>
			<Typography variant="body2">{message.body}</Typography>
		</Box>
	);
};
