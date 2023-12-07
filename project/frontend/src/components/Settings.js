import React from "react";
import {Grid} from "@mui/material";
import {ChangeUsername} from "./ChangeUsername";
import {ChangePassword} from "./ChangePassword";

const Settings = () => {
	return (<div>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<ChangeUsername />
				</Grid>
				<Grid item xs={12}>
					<ChangePassword />
				</Grid>
			</Grid>
		</div>);
};

export default Settings;
