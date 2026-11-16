import {useMutation} from "@apollo/client/react";
import {CREATE_GROUP_CONVERSATION} from "../../gql/mutations/CREATE_GROUP_CONVERSATION";


export const useCreateGroupConversation = () => {
	const [createGroupConversation, {loading, error}] = (useMutation as any)(CREATE_GROUP_CONVERSATION);
	return {createGroupConversation, loading, error};
}