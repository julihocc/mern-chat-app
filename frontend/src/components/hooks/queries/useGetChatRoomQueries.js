import { useQuery } from '@apollo/react-hooks';
import { GET_CHAT_ROOM, GET_CURRENT_USER, GET_MESSAGES_BY_CHAT_ROOM_ID } from '../../gql/gqlHub';

export default function useGetChatRoomQueries(id) {
    const useChatRoom = useQuery(GET_CHAT_ROOM, { variables: { chatRoomId: id } });
    const useMessages = useQuery(GET_MESSAGES_BY_CHAT_ROOM_ID, { variables: { chatRoomId: id } });
    const useCurrentUser = useQuery(GET_CURRENT_USER);

    return {
        useChatRoom,
        useMessages,
        useCurrentUser
    };
}
