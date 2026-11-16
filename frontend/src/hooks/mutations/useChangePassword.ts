import {useMutation} from "@apollo/client/react";
import {CHANGE_PASSWORD} from "../../gql/mutations/CHANGE_PASSWORD";

export const useChangePassword = (oldPassword?: any, newPassword?: any) => {
	const [changePassword, {data, loading, error}] = (useMutation as any)(CHANGE_PASSWORD, {
		variables: {
			oldPassword, newPassword,
		},
	},);

	return {changePassword, data, loading, error};
};
