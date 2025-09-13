import {useMutation} from "@apollo/react-hooks";
import {SEND_CONTACT_REQUEST} from "../../gql/mutations/SEND_CONTACT_REQUEST";


export const useSendContactRequest = () => {
	const [sendContactRequest, {loading, error},] = useMutation(SEND_CONTACT_REQUEST);

	return {
		sendContactRequest, loading, error
	};
}