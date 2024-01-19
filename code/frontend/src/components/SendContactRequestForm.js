// path: frontend/src/components/SendContactRequestForm.js
import React, { useEffect, useState } from "react";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGetCurrentUser } from "../hooks/queries/useGetCurrentUser";
import { useSendContactRequest } from "../hooks/mutations/useSendContactRequest";
import { useGetUserByEmail } from "../hooks/queries/useGetUserByEmail";
import logger from "../utils/logger";

const SendContactRequestForm = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [userError, setUserError] = useState(null);

  const {
    data: currentUserData,
    loading: currentUserLoading,
    error: currentUserError,
  } = useGetCurrentUser();

  const {
    sendContactRequest,
    loading: sendContactLoading,
    error: sendContactError,
  } = useSendContactRequest();

  const {
    getUserByEmail,
    loading: getUserByEmailLoading,
    error: getUserByEmailError,
    data: getUserByEmailData,
  } = useGetUserByEmail();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserError(null);
    logger.debug(`Sending contact request to ${email}...`);
    const user = await getUserByEmail({ variables: { email } });
    logger.debug(
      `Sending contact request to ${user?.data?.getUserByEmail?._id}...`
    );
  };

  useEffect(() => {
    if (getUserByEmailData && currentUserData?.getCurrentUser?._id) {
      // Added null checks
      sendContactRequest({
        variables: {
          senderId: currentUserData.getCurrentUser._id,
          recipientId: getUserByEmailData.getUserByEmail._id,
        },
      })
        .then(() => {
          setEmail("");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [
    getUserByEmailData,
    currentUserData?.getCurrentUser?._id,
    sendContactRequest,
  ]);

  if (currentUserLoading || getUserByEmailLoading) return <CircularProgress />;
  if (currentUserError) return <p>Error: {currentUserError.message}</p>;

  if (getUserByEmailError) {
    // If the getUserByEmail query results in an error, set a custom error message to inform the user that the recipient email does not exist
    setUserError("User with this email does not exist.");
  }

  return (
    <div>
      <Typography variant="h3">{t("sendContactRequest")}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          type="email"
          label={t("email")}
          placeholder={t("enterEmail")}
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={sendContactLoading}
        >
          {sendContactLoading ? t("sending") : t("send")}
        </Button>
      </form>
      {userError && <p>{userError}</p>}
      {sendContactError && <p>Error: {sendContactError.message}</p>}
    </div>
  );
};

export default SendContactRequestForm;
