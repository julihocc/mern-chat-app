// path: frontend\src\components\dashboardUtils\hooks.js
import {useMutation, useQuery} from '@apollo/react-hooks';
import {
    GET_CONTACT_REQUESTS,
    ACCEPT_CONTACT_REQUEST,
    REJECT_CONTACT_REQUEST,
    GET_CONTACTS,
    GET_CONTACT_REQUESTS_BY_CONTEXT,
    GET_CURRENT_USER
} from './gql';

export const useGetContactRequestsByContext = () => {
    const {loading, error, data} = useQuery(GET_CONTACT_REQUESTS_BY_CONTEXT, {
        fetchPolicy: 'network-only',
    });

    return {loading, error, data};
}

export const useAcceptContactRequest = (userId) => {
    const [acceptContactRequest] = useMutation(ACCEPT_CONTACT_REQUEST, {
        refetchQueries: [{query: GET_CONTACT_REQUESTS, variables: {userId}}],
    });

    return acceptContactRequest;
}

export const useRejectContactRequest = (userId) => {
    const [rejectContactRequest] = useMutation(REJECT_CONTACT_REQUEST, {
        refetchQueries: [{query: GET_CONTACT_REQUESTS, variables: {userId}}],
    });

    return rejectContactRequest;
}

export const useGetContacts = (userId) => {
    const {loading, error, data} = useQuery(GET_CONTACTS, {
        variables: {userId}, fetchPolicy: 'network-only',
    });

    return {loading, error, data};
}

export const useGetCurrentUser = () => {
    const {loading, error, data} = useQuery(GET_CURRENT_USER, {
        fetchPolicy: 'network-only',
    });

    return {loading, error, data};
}
