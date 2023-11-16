import {useQuery} from "@apollo/client";
import {GET_USER_BY_ID} from "../../gql/queries/GET_USER_BY_ID";



export const useGetSender = (message) => {
	const { loading, error, data } = useQuery(GET_USER_BY_ID, {
		variables: { userId: message.senderId },
	});
	return { loading, error, data };
}