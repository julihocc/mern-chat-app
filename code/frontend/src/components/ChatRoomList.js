import React, { useEffect, useState } from "react";
import {
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import logger from "../utils/logger"; // importing the logger
import { useGetChatRoomsForCurrentUser } from "../hooks/queries/useGetChatRoomsForCurrentUser";
import { Link } from "react-router-dom";
// import { use } from "i18next";
import { useSubscription } from "@apollo/client";
import { NEW_CHAT_ROOM } from "../gql/subscriptions/NEW_CHAT_ROOM";

const ChatRoomList = () => {
  const { t } = useTranslation();
  const ASC = "ASCending";
  const DESC = "DESCcending";

  //   logger.debug(`ChatRoomList | data(${typeof data}): ${JSON.stringify(data)} `);
  const [sortOption, setSortOption] = useState(ASC);
  const [sortedChatRooms, setSortedChatRooms] = useState([]);
  const [unsortedChatRooms, setUnsortedChatRooms] = useState([]);
  const {
    loading: loadingChatRooms,
    error: errorChatRooms,
    data: dataChatRooms,
  } = useGetChatRoomsForCurrentUser();

  const {
    data: newChatRoomData,
    error: newChatRoomError,
    loading: newChatRoomLoading,
  } = useSubscription(NEW_CHAT_ROOM, {
    onComplete: () => {
      if (dataChatRooms) {
        logger.debug(`New chat room data received: ${newChatRoomData}`);
        const sorted = [...dataChatRooms.getChatRoomsForCurrentUser];
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
      logger.debug(`useEffect | Subscribing to new chat rooms...`);
    }
    if (newChatRoomData) {
      logger.debug(
        `useEffect | New chat room data received: ${newChatRoomData}`
      );
    }
    if (newChatRoomError) {
      logger.error(
        `useEffect | Error in new chat room subscription: ${newChatRoomError}`
      );
    }
  }, [newChatRoomLoading, newChatRoomError, newChatRoomData]);

  useEffect(() => {
    if (dataChatRooms) {
      logger.debug(
        `useEffect | dataChatRooms: ${JSON.stringify(dataChatRooms)}`
      );
      setUnsortedChatRooms(dataChatRooms.getChatRoomsForCurrentUser);
	  if (!sortedChatRooms) {
		setSortedChatRooms(dataChatRooms.getChatRoomsForCurrentUser);
	  }
    }
  }, [dataChatRooms, setUnsortedChatRooms, sortedChatRooms]);

  useEffect(() => {
    logger.debug(`useEffect | sortOption: ${sortOption}`);

    logger.debug(
      `useEffect | unsortedChatRooms (before): ${sortedChatRooms.map(
        (chatRoom) => chatRoom.createdAt
      )}`
    );
    // setSortedChatRooms(sortedChatRooms.reverse());
    let temp = [...unsortedChatRooms];
    if (sortOption === ASC) {
      logger.debug(`useEffect | Sorting chat rooms in ascending order`);
      //   sortedChatRooms.sort((a, b) => Date(a.createdAt) - Date(b.createdAt));
    //   temp.sort();
      logger.debug(
        `useEffect | temp: ${temp.map((chatRoom) => chatRoom.createdAt)}`
      );
    } else if (sortOption === DESC) {
      logger.debug(`useEffect | Sorting chat rooms in descending order`);
      //   sortedChatRooms.sort((a, b) => Date(b.createdAt) - Date(a.createdAt));
    //   temp = temp.sort().reverse();
	temp = temp.reverse();
      logger.debug(
        `useEffect | temp: ${temp.map((chatRoom) => chatRoom.createdAt)}`
      );
    }
    setSortedChatRooms(temp);
  }, [sortOption, setSortedChatRooms, unsortedChatRooms, sortedChatRooms]);

  const handleSortChange = (event) => {
    logger.debug(
      `handleSortChange | event.target.value: ${event.target.value}`
    );
    setSortOption(event.target.value);
  };

  if (loadingChatRooms) return <CircularProgress />;
  if (errorChatRooms) {
    logger.error(
      `Error when trying to get chat rooms: ${errorChatRooms.message}`
    );
    return <Alert severity="error">Error: {errorChatRooms.message}</Alert>;
  }

  return (
    <div>
      <Typography variant="h3">{t("chatList")}</Typography>

      {newChatRoomData && (
        <Alert severity="info">
          New chat room: {newChatRoomData.newChatRoom.createdAt}
        </Alert>
      )}

      <FormControl fullWidth>
        <InputLabel id="sort-select-label">Sort</InputLabel>
        <Select
          labelId="sort-select-label"
          id="sort-select"
          value={sortOption}
          label="Sort"
          onChange={handleSortChange}
        >
          <MenuItem value={ASC}>Ascending</MenuItem>
          <MenuItem value={DESC}>Descending</MenuItem>
        </Select>
      </FormControl>
      <div key={sortOption}>
        <ul>
          {sortedChatRooms &&
            sortedChatRooms.map((chatRoom) => (
              <li key={chatRoom._id}>
                <Link to={`/chat/${chatRoom._id}`}>
                  Chat: {chatRoom.createdAt}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatRoomList;
