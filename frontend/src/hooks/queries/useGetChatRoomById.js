import { useQuery } from "@apollo/client";
import { GET_CHAT_ROOM_BY_ID } from "../../gql/queries/GET_CHAT_ROOM_BY_ID";

export const useGetChatRoomById = (chatRoomId) => {
  const { loading, error, data } = useQuery(GET_CHAT_ROOM_BY_ID, {
    variables: { chatRoomId: chatRoomId },
  });

  return {
    loading,
    error,
    data,
  };
};
