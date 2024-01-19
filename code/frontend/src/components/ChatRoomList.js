import React, {useEffect, useState} from "react";
import {Alert, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import logger from "../utils/logger"; // importing the logger
import {useGetChatRoomsForCurrentUser} from "../hooks/queries/useGetChatRoomsForCurrentUser";
import {Link} from "react-router-dom";

const ChatRoomList = () => {
	const {t} = useTranslation();

	const {loading, error, data} = useGetChatRoomsForCurrentUser();
	const [sortOption, setSortOption] = useState("ascending");
	const [sortedChatRooms, setSortedChatRooms] = useState([]);

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
