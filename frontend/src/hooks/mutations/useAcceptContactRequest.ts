// path: frontend/src/hooks/mutations/useAcceptContactRequest.js
import {useMutation} from "@apollo/client/react";
import {ACCEPT_CONTACT_REQUEST} from "../../gql/mutations/ACCEPT_CONTACT_REQUEST";
import {GET_CONTACT_REQUESTS} from "../../gql/queries/GET_CONTACT_REQUESTS";

export const useAcceptContactRequest = (userId: any) => {
	const [acceptContactRequest] = (useMutation as any)(ACCEPT_CONTACT_REQUEST, {
		refetchQueries: [{query: GET_CONTACT_REQUESTS, variables: {userId}}],
	});

	return acceptContactRequest;
};
