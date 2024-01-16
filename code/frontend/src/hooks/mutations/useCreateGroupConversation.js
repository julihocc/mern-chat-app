import {useMutation} from "@apollo/react-hooks";
import {CREATE_GROUP_CONVERSATION} from "../../gql/mutations/CREATE_GROUP_CONVERSATION";


export const useCreateGroupConversation = () => {
	const [createGroupConversation, {loading, error}] = useMutation(CREATE_GROUP_CONVERSATION);
	return {createGroupConversation, loading, error};
}