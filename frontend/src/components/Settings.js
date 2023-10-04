import React from 'react';
import {Grid} from "@mui/material";
import {ChangeUsername} from "./ChangeUsername";

const Settings = () => {
    return (
        <div>
        <Grid>
            <Grid item>
                {/*TODO Fixed the needing of refreshing to see new username*/}
                <ChangeUsername/>
            </Grid>
        </Grid>
        </div>
    )
}

export default Settings
