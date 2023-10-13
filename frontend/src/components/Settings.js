import React from "react";
import { Grid } from "@mui/material";
import { ChangeUsername } from "./ChangeUsername";
import { ChangePassword } from "./ChangePassword";

const Settings = () => {
  return (
    <div>
      <Grid>
        <Grid item>
          <ChangeUsername />
        </Grid>
        <Grid item>
          <ChangePassword />
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
