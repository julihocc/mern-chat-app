// path: frontend\src\components\dashboardUtils\hooks.js
import {useMutation, useQuery} from '@apollo/react-hooks';
import {
    GET_CONTACT_REQUESTS,
    ACCEPT_CONTACT_REQUEST,
    REJECT_CONTACT_REQUEST,
    GET_CONTACTS,
} from './gql';

const useGetContactRequests = (userId) => {
    const {loading, error, data} = useQuery(GET_CONTACT_REQUESTS, {
        variables: {userId}, fetchPolicy: 'network-only',
    });

    return {loading, error, data};
}

const useAcceptContactRequest = (userId) => {
    const [acceptContactRequest] = useMutation(ACCEPT_CONTACT_REQUEST, {
        refetchQueries: [{query: GET_CONTACT_REQUESTS, variables: {userId}}],
    });

    return acceptContactRequest;
}

const useRejectContactRequest = (userId) => {
    const [rejectContactRequest] = useMutation(REJECT_CONTACT_REQUEST, {
        refetchQueries: [{query: GET_CONTACT_REQUESTS, variables: {userId}}],
    });

    return rejectContactRequest;
}

const useGetContacts = (userId) => {
    const {loading, error, data} = useQuery(GET_CONTACTS, {
        variables: {userId}, fetchPolicy: 'network-only',
    });

    return {loading, error, data};
}

export {
    useGetContactRequests,
    useAcceptContactRequest,
    useRejectContactRequest,
    useGetContacts,
};
