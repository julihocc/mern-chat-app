// frontend\src\components\dashboardUtils\CreateGroupConversation.js

import React, { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGetCurrentUser } from "../hooks/queries/useGetCurrentUser";
import logger from "../utils/logger";
import { useCreateGroupConversation } from "../hooks/mutations/useCreateGroupConversation";
// import { use } from "i18next";
import { useEffect } from "react";
// import { use } from "i18next";

const CreateGroupConversation = () => {
  logger.debug("CreateGroupConversation");
  const { t } = useTranslation();
  const [emailsInput, setEmailsInput] = useState("");
  const [error, setError] = useState(null);

  const {
    createGroupConversation,
    loading: loadingCreateConversation,
    error: errorCreateConversation,
  } = useCreateGroupConversation();

  useEffect(() => {
    if (errorCreateConversation) {
      logger.error(
        `Error when creating conversation: ${errorCreateConversation.message}`
      );
      setError(errorCreateConversation.message);
    }
  }, [errorCreateConversation]);

  const currentUser = useGetCurrentUser();
  logger.debug("currentUser", currentUser);

  const userEmail = currentUser.email;
  logger.debug("userEmail", userEmail);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailsInput === "") {
      setError("Please enter at least one email address");
      return;
    }

    const additionalEmails = emailsInput
      .split(",")
      .map((email) => email.trim());

    try {
      const result = await createGroupConversation({
        variables: { additionalEmails },
      });
      logger.debug("result: ", result);

      logger.debug("Conversation created successfully");
      setEmailsInput("");
    } catch (err) {
      logger.error(`Error creating conversation: ${err}`);
      setError(err.message);
    }
  };

  return (
    <div>
      <Typography variant="h3">{t("createGroupConversation")}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          id="additionalEmails"
          label={t("additionalEmails")}
          placeholder={t("enterCommaSeparatedEmails")}
          variant="outlined"
          value={emailsInput}
          onChange={(e) => setEmailsInput(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loadingCreateConversation}
        >
          {t("create")}
        </Button>
      </form>
      {loadingCreateConversation && <CircularProgress />}
      {/* {errorCreateConversation && (
        <Alert severity="error">
          Error when creating conversation: {errorCreateConversation.message}
        </Alert>
      )} */}
      {error && (
        <Alert
          severity="error"
          onClose={() => {
            setError(null);
          }}
        >
          {error}
        </Alert>
      )}
    </div>
  );
};

export default CreateGroupConversation;
