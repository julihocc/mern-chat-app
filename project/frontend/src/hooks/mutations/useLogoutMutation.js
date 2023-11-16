import {useMutation} from "@apollo/client";
import {LOGOUT_MUTATION} from "../../gql/mutations/LOGOUT_MUTATION";


export const useLogoutMutation = () => {
	const [logoutMutation, { loading, error }] = useMutation(LOGOUT_MUTATION);

	return { logoutMutation, loading, error };
}