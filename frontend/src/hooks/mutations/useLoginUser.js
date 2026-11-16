import {useMutation} from "@apollo/client";
import logger from "../../utils/logger";
import {LOGIN_USER} from "../../gql/mutations/LOGIN_USER";

export const useLoginUser = () => {

	const [loginUser, {loading, error, data}] = useMutation(LOGIN_USER, {
		onError(err) {
			logger.error("Login Error:", err.message);
		}, onCompleted() {
			logger.debug("Login successful.");
		},
	});

	return {loginUser, loading, error, data};
}