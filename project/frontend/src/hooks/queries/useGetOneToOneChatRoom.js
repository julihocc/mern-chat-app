import { useQuery } from "@apollo/client";
import { GET_ONE_TO_ONE_CHATROOM } from "../../gql/queries/GET_ONE_TO_ONE_CHATROOM";

export default function useGetOneToOneChatRoom(contactId) {
  const {
    data: oneToOneChatRoomData,
    loading: oneToOneChatRoomLoading,
    error: oneToOneChatRoomError,
  } = useQuery(GET_ONE_TO_ONE_CHATROOM, {
    variables: { contactId: contactId },
  });
  return {
    oneToOneChatRoomData,
    oneToOneChatRoomLoading,
    oneToOneChatRoomError,
  };
}
