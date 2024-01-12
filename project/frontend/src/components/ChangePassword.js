import React, { useEffect, useState } from "react";
import { useChangePassword } from "../hooks/mutations/useChangePassword";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import logger from "../utils/logger";

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { changePassword } = useChangePassword();

  const handlePasswordChange = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        logger.error("All fields must be filled");
        // alert("Please fill in all fields");
        setErrorMessage("All fields must be filled");
        return;
      }

      if (newPassword !== confirmPassword) {
        logger.error("Password and its confirmation do not match");
        setErrorMessage("Password and its confirmation do not match");
        return;
      }

      if (newPassword === currentPassword) {
        logger.error("New password must be different from the current one");
        setErrorMessage("New password must be different from the current one");
        return;
      }

      await changePassword({
        variables: { oldPassword: currentPassword, newPassword },
      });
    } catch (error) {
      // throw new Error(`Could not change password: ${error.message}`);
      logger.error(`Could not change password: ${error.message}`);
      setErrorMessage(`Could not change password: ${error.message}`);
    }

    logger.debug(`Password changed successfully`);
    setSuccessMessage("Password change successfully");
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h6">Change Password</Typography>
      <TextField
        type="password"
        label="Current Password"
        variant="outlined"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        margin="normal"
      />
      <TextField
        type="password"
        label="New Password"
        variant="outlined"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        margin="normal"
      />
      <TextField
        type="password"
        label="Confirm New Password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handlePasswordChange}
      >
        Change Password
      </Button>
      {errorMessage && (
        <Alert severity="error" style={{ marginTop: "20px" }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" style={{ marginTop: "20px" }}>
          {successMessage}
        </Alert>
      )}
    </Box>
  );
};
