import React from "react";
import {ApolloProvider} from "@apollo/react-hooks";
import {Grid} from "@mui/material";
import {ChangeUsername} from "./ChangeUsername";
import {ChangePassword} from "./ChangePassword";
import {authServiceApolloClient} from "../apolloClient";

const Settings = () => {
    return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <ChangeUsername client = {authServiceApolloClient}/>
                    </Grid>
                    <Grid item xs={12}>
                        <ChangePassword client = {authServiceApolloClient} />
                    </Grid>
                </Grid>
            </div>
    );
};

export default Settings;
