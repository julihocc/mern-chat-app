import {useLazyQuery} from "@apollo/client/react";
import {GET_USER_BY_EMAIL} from "../../gql/queries/GET_USER_BY_EMAIL";


export const useGetUserByEmail = () => {
	const [getUserByEmail, {
		loading, error, data,
	},] = (useLazyQuery as any)(GET_USER_BY_EMAIL);

	return {
		getUserByEmail, loading, error, data,
	}
}