import {useMutation} from "@apollo/client/react";
import logger from "../../utils/logger";
import {setUser} from "../../redux/slices/userSlice";
import {SIGNUP} from "../../gql/mutations/SIGNUP";


export const useSignup = (setErrorMessage, navigate, dispatch) => {
	const [signUp, {error}] = useMutation(SIGNUP, {
		onError(err) {
			logger.error("Signup Error:", err.message);
			setErrorMessage(err.message);
			navigate("/signup");
		}, onCompleted(data) {
			dispatch(setUser(data.signUp.user));
			navigate("/dashboard");
		},
	});

	return {signUp, error}
}