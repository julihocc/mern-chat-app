import {useQuery} from "@apollo/react-hooks";
import {GET_CONTACT_REQUESTS_BY_CONTEXT} from "../../gql/queries/GET_CONTACT_REQUESTS_BY_CONTEXT";

export const useGetContactRequestsByContext = () => {
    const {loading, error, data} = useQuery(GET_CONTACT_REQUESTS_BY_CONTEXT, {
        fetchPolicy: 'network-only',
    });

    return {loading, error, data};
}
