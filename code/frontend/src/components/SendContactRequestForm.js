// path: frontend/src/components/SendContactRequestForm.js
import React, { useEffect, useState } from "react";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGetCurrentUser } from "../hooks/queries/useGetCurrentUser";
import { useSendContactRequest } from "../hooks/mutations/useSendContactRequest";
import { useGetUserByEmail } from "../hooks/queries/useGetUserByEmail";
import logger from "../utils/logger";
import { use } from "i18next";

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

  logger.debug(
    `SendContactRequestForm | getUserByEmailError: ${getUserByEmailError}`
  );
  logger.debug(
    `SendContactRequestForm | getUserByEmailData: ${JSON.stringify(
      getUserByEmailData
    )}`
  );

  // useEffect(() => {
  //   logger.debug(`sendContactRequest| useEffect | error: ${sendContactError}`);
  //   if (sendContactError) {
  //     setError(sendContactError);
  //   }
  // }, [sendContactError]);

  // useEffect(() => {
  //   logger.debug(
  //     `SendContactRequestForm | useEffect | getUserByEmailError: ${JSON.stringify(
  //       getUserByEmailError
  //     )}`
  //   );
  //   if (getUserByEmailError) {
  //     setError(getUserByEmailError);
  //   }
  // }, [getUserByEmailError]);

  // useEffect(() => {
  //   try {
  //     logger.debug(
  //       `SendContactRequestForm | useEffect | getUserByEmailData: ${JSON.stringify(
  //         getUserByEmailData
  //       )}`
  //     );
  //     logger.debug(
  //       `SendContactRequestForm | useEffect | currentUserData: ${JSON.stringify(
  //         currentUserData
  //       )}`
  //     );
  //     let senderId = null;
  //     let recipientId = null;
  //     if (currentUserData?.getCurrentUser?._id) {
  //       senderId = currentUserData.getCurrentUser._id;
  //       logger.debug(`senderId: ${senderId}`);
  //     }
  //     if (getUserByEmailData?.getUserByEmail?._id) {
  //       recipientId = getUserByEmailData.getUserByEmail._id;
  //       logger.debug(`recipientId: ${recipientId}`);
  //     }
  //     if (senderId && recipientId) {
  //       logger.debug(`sendContactRequest | sending contact request`);
  //       sendContactRequest({
  //         variables: {
  //           senderId,
  //           recipientId,
  //         },
  //       });
  //       logger.debug(`sendContactRequest | contact request sent`);
  //     }
  //   } catch (err) {
  //     logger.error(`Error sending contact request: ${err.message}`);
  //     setError(err);
  //   }
  // }, [
  //   getUserByEmailData,
  //   sendContactRequest,
  //   currentUserData,
  //   setError,
  // ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    logger.debug(`SendContactRequestForm | handleSubmit | ${recipientEmail}`);

    try {
      if (!recipientEmail) {
        throw new Error("Please enter an email address");
      }

      logger.debug(
        `SendContactRequestForm | handleSubmit | getUserByEmail | awaiting`
      );

      try {
        await getUserByEmail({
          variables: { email: recipientEmail },
        });
      } catch (err) {
        logger.error(
          `SendContactRequestForm | handleSubmit | getUserByEmailError: ${err.message}`
        );
        throw new Error(err);
      }

      logger.debug(
        `SendContactRequestForm | handleSubmit | getUserByEmail | completed`
      );
    } catch (err) {
      logger.error(
        `SendContactRequestForm | handleSubmit | error: ${err.message}`
      );
      setError(err);
            logger.error(
              `SendContactRequestForm | handleSubmit | setError: ${error.message}`
            );
    }
  };

  // if (currentUserLoading || getUserByEmailLoading) return <CircularProgress />;
  if (currentUserLoading) return <p> Current User Loading... </p>;
  if (getUserByEmailLoading) return <p> Get User By Email Loading... </p>;
  if (currentUserError) return <p>Error: {currentUserError.message}</p>;

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
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default SendContactRequestForm;
