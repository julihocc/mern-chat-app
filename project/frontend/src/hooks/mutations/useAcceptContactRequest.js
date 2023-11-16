// path: frontend/src/hooks/mutations/useAcceptContactRequest.js
import {useMutation} from "@apollo/react-hooks";
import {ACCEPT_CONTACT_REQUEST} from "../../gql/mutations/ACCEPT_CONTACT_REQUEST";
import {GET_CONTACT_REQUESTS} from "../../gql/queries/GET_CONTACT_REQUESTS";

export const useAcceptContactRequest = (userId) => {
	const [acceptContactRequest] = useMutation(ACCEPT_CONTACT_REQUEST, {
		refetchQueries: [{query: GET_CONTACT_REQUESTS, variables: {userId}}],
	});

	return acceptContactRequest;
};
