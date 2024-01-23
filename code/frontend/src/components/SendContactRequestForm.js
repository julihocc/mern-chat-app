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
  const [recipientEmail, setRecipientEmail] = useState("");
  const [error, setError] = useState(null);

  const {
    data: currentUserData,
    loading: currentUserLoading,
    error: currentUserError,
  } = useGetCurrentUser();

  logger.debug(
    `SendContactRequestForm | currentUserData: ${JSON.stringify(
      currentUserData
    )}`
  );

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

  useEffect(() => {
    logger.debug(
      `SendContactRequestForm | useEffect | getUserByEmailData: ${JSON.stringify(
        getUserByEmailData
      )}`
    );
    logger.debug(
      `SendContactRequestForm | useEffect | currentUserData: ${JSON.stringify(
        currentUserData
      )}`
    );
    let senderId=null;
    let recipientId=null;
    if (currentUserData?.getCurrentUser?._id) {
      senderId = currentUserData.getCurrentUser._id;
      logger.debug(`senderId: ${senderId}`);
    }
    if (getUserByEmailData?.getUserByEmail?._id) {
      recipientId = getUserByEmailData.getUserByEmail._id;
      logger.debug(`recipientId: ${recipientId}`);
    }
    if (senderId && recipientId) {
      sendContactRequest({
        variables: {
          senderId,
          recipientId,
        },
      });
    }
  }, [getUserByEmailData, sendContactRequest, currentUserData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    logger.debug(`SendContactRequestForm | handleSubmit | ${recipientEmail}`);
    try {
      await getUserByEmail({ variables: { email: recipientEmail } });
    } catch (getUserByEmailError) {
      logger.error(
        `SendContactRequestForm | handleSubmit | getUserByEmailError: ${getUserByEmailError.message}`
      );
      setError(getUserByEmailError);
    }
  };

  if (currentUserLoading || getUserByEmailLoading) return <CircularProgress />;
  if (currentUserError) return <p>Error: {currentUserError.message}</p>;

  if (getUserByEmailError) {
    // If the getUserByEmail query results in an error, set a custom error message to inform the user that the recipient email does not exist
    setError("User with this email does not exist.");
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
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
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
      {error && <p>{error.message}</p>}
      {sendContactError && <p>Error: {sendContactError.message}</p>}
    </div>
  );
};

export default SendContactRequestForm;
