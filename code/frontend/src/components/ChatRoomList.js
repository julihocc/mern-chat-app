import React, {useEffect, useState} from "react";
import {Alert, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import logger from "../utils/logger"; // importing the logger
import {useGetChatRoomsForCurrentUser} from "../hooks/queries/useGetChatRoomsForCurrentUser";
import {Link} from "react-router-dom";
// import { use } from "i18next";
import { useSubscription } from "@apollo/client";
import { NEW_CHAT_ROOM } from "../gql/subscriptions/NEW_CHAT_ROOM";

const ChatRoomList = () => {
	const {t} = useTranslation();

	const {loading, error, data} = useGetChatRoomsForCurrentUser();
	const [sortOption, setSortOption] = useState("ascending");
	const [sortedChatRooms, setSortedChatRooms] = useState([]);

	const {
		data: newChatRoomData,
		error: newChatRoomError,
		loading: newChatRoomLoading,
	} = useSubscription(NEW_CHAT_ROOM, {
		onComplete: () => {
			if (data) {
				const sorted = [...data.getChatRoomsForCurrentUser];
				if (sortOption === "ascending") {
					sorted.sort((a, b) => a.createdAt - b.createdAt);
				} else if (sortOption === "descending") {
					sorted.sort((a, b) => b.createdAt - a.createdAt);
				}
				setSortedChatRooms(sorted);
			}
		},
		onError: (err) => {
			logger.error(`*Error in new chat room subscription: ${err}`);
		},
	});

	useEffect(() => {
		if (newChatRoomLoading) {
			logger.debug(`Subscribing to new chat rooms...`);
		}
		if (newChatRoomData) {
			logger.debug(`New chat room data received: ${newChatRoomData}`);
		}
		if (newChatRoomError) {
			logger.error(`Error in new chat room subscription: ${newChatRoomError}`);
		}
		if (data) {
			const sorted = [...data.getChatRoomsForCurrentUser];
			if (sortOption === "ascending") {
				sorted.sort((a, b) => a.createdAt - b.createdAt);
			} else if (sortOption === "descending") {
				sorted.sort((a, b) => b.createdAt - a.createdAt);
			}
			setSortedChatRooms(sorted);
		}
	}, [newChatRoomLoading, newChatRoomError, newChatRoomData, data, sortOption]);

	useEffect(() => {
		let sorted;

		if (data) {
			sorted = [...data.getChatRoomsForCurrentUser];
		} else {
			sorted = [];
		}

		if (sortOption === "ascending") {
			logger.debug(`Sorting chat rooms in ascending order`);
			sorted.sort((a, b) => a.createdAt - b.createdAt);
		} else if (sortOption === "descending") {
			logger.debug(`Sorting chat rooms in descending order`);
			sorted.sort((a, b) => b.createdAt - a.createdAt);
		}

		logger.debug(`Sorted Chatrooms ${sortOption}: ${sorted.map((chatRoom) => chatRoom.createdAt,)}`,);

		setSortedChatRooms(sorted);
	}, [sortOption, data]);

	const handleSortChange = (event) => {
		setSortOption(event.target.value);
		logger.debug(`Sort option changed to: ${event.target.value}`);
	};
	if (loading) return <CircularProgress/>;
	if (error) {
		logger.error(`Error when trying to get chat rooms: ${error.message}`);
		return <Alert severity="error">Error: {error.message}</Alert>;
	}

	return (<div>
		<Typography variant="h3">{t("chatList")}</Typography>

		{ 
			newChatRoomData && (
				<Alert severity="info">
					New chat room: {newChatRoomData.newChatRoom.createdAt}
				</Alert>
			)
		}

		<FormControl fullWidth>
			<InputLabel id="sort-select-label">Sort</InputLabel>
			<Select
				labelId="sort-select-label"
				id="sort-select"
				value={sortOption}
				label="Sort"
				onChange={handleSortChange}
			>
				<MenuItem value="ascending">Ascending</MenuItem>
				<MenuItem value="descending">Descending</MenuItem>
			</Select>
		</FormControl>
		<div key={sortOption}>
			<ul>
				{sortedChatRooms && sortedChatRooms.map((chatRoom) => (<li key={chatRoom._id}>
					<Link to={`/chat/${chatRoom._id}`}>
						Chat: {chatRoom.createdAt}
					</Link>
				</li>))}
			</ul>
		</div>
	</div>);
};

export default ChatRoomList;
