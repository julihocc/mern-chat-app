import {useMutation} from '@apollo/react-hooks';
// import {CHANGE_USERNAME} from 'frontend/src/gql/mutations/CHANGE_USERNAME.js'
import {CHANGE_USERNAME} from '../../gql/mutations/CHANGE_USERNAME'
export const useChangeUsername = (newUsername) => {
    const [changeUsername] = useMutation(CHANGE_USERNAME)
    return changeUsername
}
