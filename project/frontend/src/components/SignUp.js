// Path: frontend\src\components\SignUp.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useNavigate } from "react-router-dom";
import {Alert, Button, TextField} from "@mui/material";
import { useTranslation } from "react-i18next";
import logger from "../utils/logger";
import { setUser } from "../redux/slices/userSlice";
import {useSignup} from "../hooks/mutations/useSignup";

// const SIGNUP = gql`
//   mutation SignUp(
//     $username: String!
//     $email: String!
//     $password: String!
//     $confirmPassword: String!
//   ) {
//     signUp(
//       username: $username
//       email: $email
//       password: $password
//       confirmPassword: $confirmPassword
//     ) {
//       token
//       user {
//         id
//         username
//         email
//       }
//     }
//   }
// `;

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");

  // const [signUp, { error }] = useMutation(SIGNUP, {
  //   onError(err) {
  //     logger.error("Signup Error:", err.message);
  //     setErrorMessage(err.message);
  //     navigate("/signup");
  //   },
  //   onCompleted(data) {
  //     document.cookie = `token=${data.signUp.token}; path=/; max-age=3600`;
  //     dispatch(setUser());
  //     navigate("/dashboard");
  //   },
  // });

  const {signUp, error} = useSignup(setErrorMessage, navigate, dispatch);

  if (error) return <p>SIGNUP_USER Error: {error.message}</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // logger.error("Passwords don't match!");
      setErrorMessage(t("passwordsDoNotMatch"));
      return;
    }

    try {
      await signUp({
        variables: { username, email, password, confirmPassword },
      });
    } catch (err) {
      console.error("handleSubmit Error:", err.message);
    }
  };

  return (
    <div>
      <h2>{t("signup")}</h2>
      <form onSubmit={handleSubmit}>

        <TextField
          label={t("username")}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrorMessage("");
          }}
        />

        <TextField
          type="email"
          label={t("email")}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrorMessage("");
          }}
        />

        <TextField
          type="password"
          label={t("password")}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorMessage("");
          }}
        />

        <TextField
          type="password"
          label={t("confirmPassword")}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrorMessage("");
          }}
        />

        <Button type="submit" variant="contained" color="primary">
          {t("signup")}
        </Button>
      </form>

      {errorMessage && (
          <Alert severity="error" style={{ marginTop: '20px' }}>
            {errorMessage}
          </Alert>
      )}

    </div>
  );
};

export default Signup;
