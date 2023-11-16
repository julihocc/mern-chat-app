import {useMutation} from "@apollo/react-hooks";
import {SEND_CONTACT_REQUEST} from "../../gql/mutations/SEND_CONTACT_REQUEST";

// const [
// 	sendContactRequest,
// 	{ loading: sendContactLoading, error: sendContactError },
// ] = useMutation(SEND_CONTACT_REQUEST);

export const useSendContactRequest = () => {
	const [
		sendContactRequest,
		{ loading, error },
	] = useMutation(SEND_CONTACT_REQUEST);

	return {
        sendContactRequest,
        loading,
        error
    };
}