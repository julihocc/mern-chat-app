import {useMutation} from "@apollo/client/react";
import {LOGOUT_MUTATION} from "../../gql/mutations/LOGOUT_MUTATION";


export const useLogoutMutation = () => {
	const [logoutMutation, { loading, error }] = (useMutation as any)(LOGOUT_MUTATION);

	return { logoutMutation, loading, error };
}