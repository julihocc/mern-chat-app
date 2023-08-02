import {useMutation} from "@apollo/react-hooks";
// import {GET_CONTACT_REQUESTS, REJECT_CONTACT_REQUEST} from "../../gql/gqlHub";
import { GET_CONTACT_REQUESTS } from "../../gql/queries/GET_CONTACT_REQUESTS";
import { REJECT_CONTACT_REQUEST } from "../../gql/mutations/REJECT_CONTACT_REQUEST";

export const useRejectContactRequest = (userId) => {
    const [rejectContactRequest] = useMutation(REJECT_CONTACT_REQUEST, {
        refetchQueries: [{query: GET_CONTACT_REQUESTS, variables: {userId}}],
    });

    return rejectContactRequest;
}
