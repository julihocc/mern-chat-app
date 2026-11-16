import {useMutation} from "@apollo/client/react";
import {CHANGE_USERNAME} from "../../gql/mutations/CHANGE_USERNAME";

export const useChangeUsername = (newUsername?: any, currentPassword?: any) => {
	const [changeUsername, {data, loading, error}] = (useMutation as any)(CHANGE_USERNAME, {
		variables: {
			newUsername, currentPassword,
		},
	});
	return {changeUsername, data, loading, error};
};
