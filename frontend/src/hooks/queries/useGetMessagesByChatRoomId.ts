import { useQuery } from "@apollo/client/react";
import { GET_MESSAGES_BY_CHATROOM_ID } from "../../gql/queries/GET_MESSAGES_BY_CHATROOM_ID";

export default function useGetMessagesByChatRoomId(id: any) {
  const {
    data: messageData,
    loading: messageLoading,
    error: messageError,
  } = (useQuery as any)(GET_MESSAGES_BY_CHATROOM_ID, {
    variables: { chatRoomId: id },
  });
  return { messageData, messageLoading, messageError };
}
