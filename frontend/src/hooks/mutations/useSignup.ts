import {useMutation} from "@apollo/client/react";
import logger from "../../utils/logger";
import {setUser} from "../../redux/slices/userSlice";
import {SIGNUP} from "../../gql/mutations/SIGNUP";


export const useSignup = (setErrorMessage: any, navigate: any, dispatch: any) => {
	const [signUp, {error}] = (useMutation as any)(SIGNUP, {
		onError(err: any) {
			logger.error("Signup Error:", err.message);
			setErrorMessage(err.message);
			navigate("/signup");
		}, onCompleted(data: any) {
			dispatch(setUser(data.signUp.user));
			navigate("/dashboard");
		},
	});

	return {signUp, error}
}