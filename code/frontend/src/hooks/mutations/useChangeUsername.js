import {useMutation} from "@apollo/react-hooks";
import {CHANGE_USERNAME} from "../../gql/mutations/CHANGE_USERNAME";

export const useChangeUsername = (newUsername, currentPassword) => {
	const [changeUsername, {data, loading, error}] = useMutation(CHANGE_USERNAME, {
		variables: {
			newUsername, currentPassword,
		},
	});
	return {changeUsername, data, loading, error};
};
