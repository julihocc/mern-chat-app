import {useLazyQuery} from "@apollo/react-hooks";
import {GET_USER_BY_EMAIL} from "../../gql/queries/GET_USER_BY_EMAIL";


export const useGetUserByEmail = () => {
	const [getUserByEmail, {
		loading, error, data,
	},] = useLazyQuery(GET_USER_BY_EMAIL);

	return {
		getUserByEmail, loading, error, data,
	}
}