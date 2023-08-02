import {useQuery} from "@apollo/client";
import {GET_MESSAGES_BY_CHATROOM_ID} from "../../gql/queries/GET_MESSAGES_BY_CHATROOM_ID";

export default function useGetMessagesByChatRoomId(id) {
    const { data: messageData, loading: messageLoading, error: messageError } = useQuery(GET_MESSAGES_BY_CHATROOM_ID, {
        variables: { chatRoomId: id },
    });
    return  { messageData, messageLoading, messageError }
}
