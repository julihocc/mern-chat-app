import { useQuery } from "@apollo/client/react";
import { GET_CHAT_ROOM_BY_ID } from "../../gql/queries/GET_CHAT_ROOM_BY_ID";

export const useGetChatRoomById = (chatRoomId: any) => {
  const { loading, error, data } = (useQuery as any)(GET_CHAT_ROOM_BY_ID, {
    variables: { chatRoomId: chatRoomId },
  });

  return {
    loading,
    error,
    data,
  };
};
