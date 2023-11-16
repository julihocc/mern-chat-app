import {useMutation} from "@apollo/react-hooks";
import logger from "../../utils/logger";
import {setUser} from "../../redux/slices/userSlice";
import {SIGNUP} from "../../gql/mutations/SIGNUP";



export const useSignup = (setErrorMessage, navigate, dispatch) => {
	const [signUp, { error }] = useMutation(SIGNUP, {
		onError(err) {
			logger.error("Signup Error:", err.message);
			setErrorMessage(err.message);
			navigate("/signup");
		},
		onCompleted(data) {
			document.cookie = `token=${data.signUp.token}; path=/; max-age=3600`;
			dispatch(setUser());
			navigate("/dashboard");
		},
	});

	return {signUp, error}
}