import { useQuery } from '@apollo/react-hooks';
import { GET_CHAT_ROOM, GET_CURRENT_USER, GET_MESSAGES_BY_CHAT_ROOM_ID } from './gql';

export default function useChatRoomQuery(id) {
    const chatRoom = useQuery(GET_CHAT_ROOM, { variables: { chatRoomId: id } });
    const messages = useQuery(GET_MESSAGES_BY_CHAT_ROOM_ID, { variables: { chatRoomId: id } });
    const currentUser = useQuery(GET_CURRENT_USER);

    return { chatRoom, messages, currentUser };
}
