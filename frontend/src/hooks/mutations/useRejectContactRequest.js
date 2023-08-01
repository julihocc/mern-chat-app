import {useMutation} from "@apollo/react-hooks";
import {GET_CONTACT_REQUESTS, REJECT_CONTACT_REQUEST} from "../../gql/gqlHub";

export const useRejectContactRequest = (userId) => {
    const [rejectContactRequest] = useMutation(REJECT_CONTACT_REQUEST, {
        refetchQueries: [{query: GET_CONTACT_REQUESTS, variables: {userId}}],
    });

    return rejectContactRequest;
}
