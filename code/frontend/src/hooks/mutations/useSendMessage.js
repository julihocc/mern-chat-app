import {SEND_MESSAGE} from "../../gql/mutations/SEND_MESSAGE";
import {GET_MESSAGES_BY_CHATROOM_ID} from "../../gql/queries/GET_MESSAGES_BY_CHATROOM_ID";
import {useMutation} from "@apollo/react-hooks";
import logger from "../../utils/logger";


export const useSendMessage = (chatRoomId) => {
	const [sendMessageMutation, {loading, error},] = useMutation(SEND_MESSAGE, {
		refetchQueries: [{query: GET_MESSAGES_BY_CHATROOM_ID, variables: {chatRoomId}},], onCompleted: (data) => {
			logger.debug("Message sent successfully:", data);
		}, onError: (error) => {
			logger.error("Error sending message:", error);
		},
	});

	return {
		sendMessageMutation, loading, error
	};
}