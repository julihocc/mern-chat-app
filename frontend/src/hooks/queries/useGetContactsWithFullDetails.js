import {useQuery} from "@apollo/react-hooks";
import {GET_CONTACTS_WITH_FULL_DETAILS} from "../../gql/queries/GET_CONTACTS_WITH_FULL_DETAILS";

export const useGetContactsWithFullDetails = () => {
    const {data, loading, error} = useQuery(GET_CONTACTS_WITH_FULL_DETAILS, {
        fetchPolicy: 'cache-and-network'
    });

    return {
        data,
        loading,
        error
    }
}
