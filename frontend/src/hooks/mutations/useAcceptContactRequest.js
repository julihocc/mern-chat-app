//path: /src/hooks/useAcceptContactRequest.js
import {useMutation} from "@apollo/react-hooks";
import { ACCEPT_CONTACT_REQUEST, GET_CONTACT_REQUESTS } from "../../gql/gqlHub";

export const useAcceptContactRequest = (userId) => {
    const [acceptContactRequest] = useMutation(ACCEPT_CONTACT_REQUEST, {
        refetchQueries: [{query: GET_CONTACT_REQUESTS, variables: {userId}}],
    });

    return acceptContactRequest;
}
