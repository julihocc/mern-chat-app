import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Alert, CircularProgress, Container, Grid, Typography,} from "@mui/material";
import SendContactRequestForm from "./SendContactRequestForm";
import PendingContactRequestsList from "./PendingContactRequestsList";
import CreateGroupConversation from "./CreateGroupConversation";
import {useTranslation} from "react-i18next";
import logger from "../utils/logger";
import {initiateFetchCurrentUser} from "../redux/actions";
import {Gravatar} from "./Gravatar";
import ChatRoomList from "./ChatRoomList";
import {ContactListWithChatRoom} from "./ContactListWithChatRoom";
import {Link} from "react-router-dom";

const Dashboard = () => {
	const {t} = useTranslation();
	const dispatch = useDispatch();


	const {loading, error, isLoggedIn, user} = useSelector((state) => state.user,);

	logger.info(`Dashboard: ${JSON.stringify(user)}`);


	useEffect(() => {
		if (isLoggedIn) {
			dispatch(initiateFetchCurrentUser());
		}
	}, [dispatch, isLoggedIn]);

	if (loading) return <CircularProgress/>;

	if (error) {
		logger.error(`GET_CURRENT_USER Error: ${error}`);
		return <Alert severity="error">{t("An error occurred")}</Alert>;
	}

	if (!isLoggedIn) {
		return <div>Please log in.</div>;
	}

	return (<Container>
			<Grid container spacing={3} direction="column">
				<Grid container direction="row" spacing={10}>
					{/* Column 1 */}
					<Grid item xs={12} sm={8} md={7}>
						{/*<Grid container direction="column" spacing={3}>*/}
						<Grid item>
							<Typography variant="h1">{t("dashboard")}</Typography>
							<Typography variant="h2">
								{t("currentUser")}: {user?.username || user?.email || t("guest")}
							</Typography>
						</Grid>
						<Grid item>
							<PendingContactRequestsList/>
						</Grid>
						<Grid item>
							<CreateGroupConversation/>
						</Grid>
						<Grid item>
							<SendContactRequestForm/>
						</Grid>
						{/*</Grid>*/}
					</Grid>

					{/* Column 2 */}
					<Grid item xs={12} sm={4} md={5}>
						<Grid item>
							<Gravatar/>
						</Grid>
						<Grid item>
							<ChatRoomList/>
						</Grid>
						<Grid item>
							<ContactListWithChatRoom/>
						</Grid>
						<Grid item>
							<Link to="/settings">
								<Typography variant="h3">{t("settings")}</Typography>
							</Link>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Container>);
};

export default Dashboard;
