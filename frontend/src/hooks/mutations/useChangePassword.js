import { useMutation } from "@apollo/react-hooks";
import { CHANGE_PASSWORD } from "../../gql/mutations/CHANGE_PASSWORD";

export const useChangePassword = (oldPassword, newPassword) => {
  const [changePassword, { data, loading, error }] = useMutation(
    CHANGE_PASSWORD,
    {
      variables: {
        oldPassword,
        newPassword,
      },
    },
  );

  return { changePassword, data, loading, error };
};
