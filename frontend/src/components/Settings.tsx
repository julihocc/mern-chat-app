import React from "react";
import {Grid} from "@mui/material";
import {ChangeUsername} from "./ChangeUsername.tsx";
import {ChangePassword} from "./ChangePassword.tsx";

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
