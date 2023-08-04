// path: frontend/src/hooks/queries/useGetChatRoomUsers.js
import {useQuery} from "@apollo/react-hooks";
import {GET_CHAT_ROOM_USERS} from "../../gql/queries/GET_CHAT_ROOM_USERS";

export function useGetChatRoomUsers(chatRoomId) {
    const { loading, error, data } = useQuery(GET_CHAT_ROOM_USERS, {
        variables: { chatRoomId },
    });

    return {
        loading,
        error,
        data,
    };
}
