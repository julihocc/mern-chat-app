import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { Grid } from "@mui/material";
import { ChangeUsername } from "./ChangeUsername";
import { ChangePassword } from "./ChangePassword";
import { authServiceApolloClient } from "../apolloClient";

const Settings = () => {
  return (
      <ApolloProvider client={authServiceApolloClient}>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ChangeUsername />
            </Grid>
            <Grid item xs={12}>
              <ChangePassword />
            </Grid>
          </Grid>
        </div>
      </ApolloProvider>
  );
};

export default Settings;
