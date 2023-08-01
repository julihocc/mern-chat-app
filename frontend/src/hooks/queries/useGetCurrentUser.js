import {useQuery} from "@apollo/react-hooks";
import {GET_CURRENT_USER} from "../../gql/gqlHub";

export const useGetCurrentUser = () => {
    const {loading, error, data} = useQuery(GET_CURRENT_USER, {
        fetchPolicy: 'network-only',
    });

    return {loading, error, data};
}
