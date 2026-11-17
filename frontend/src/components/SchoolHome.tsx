import React, {useState} from "react";
import {
	Alert,
	Button,
	Checkbox,
	FormControlLabel,
	MenuItem,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import {useMutation, useQuery, useSubscription} from "@apollo/client/react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
	ADD_EXPERT,
	CREATE_SCHOOL_GROUP,
	SCHOOL_GROUPS,
	START_SCHOOL_CONVERSATION,
	SUGGEST_QUESTION_WORDING,
	TAKE_SCHOOL_CONVERSATION,
	UPLOAD_SCHOOL_DOCUMENT,
	WAITING_CONVERSATION_SUBSCRIPTION,
	WAITING_CONVERSATIONS,
} from "../gql/school";

const WaitingList = ({groupId}: {groupId: string}) => {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const {data, refetch} = (useQuery as any)(WAITING_CONVERSATIONS, {variables: {groupId}});
	(useSubscription as any)(WAITING_CONVERSATION_SUBSCRIPTION, {
		variables: {groupId},
		onData: () => refetch(),
	});
	const [takeQuestion] = (useMutation as any)(TAKE_SCHOOL_CONVERSATION);
	const items = (data?.waitingConversations || []).filter((item: any) => item.open);

	if (!items.length) {
		return null;
	}

	return (
		<Stack spacing={1}>
			{items.map((item: any) => (
				<Stack key={item._id} direction="row" spacing={1} alignItems="center">
					<Typography>
						{item.username}: {item.question}
					</Typography>
					<Button
						variant="outlined"
						onClick={async () => {
							await takeQuestion({variables: {chatRoomId: item._id}});
							navigate(`/chat/${item._id}`);
						}}
					>
						{t("takeQuestion")}
					</Button>
				</Stack>
			))}
		</Stack>
	);
};

const SchoolHome = () => {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const {data, error, refetch} = (useQuery as any)(SCHOOL_GROUPS);
	const [groupId, setGroupId] = useState("");
	const [draft, setDraft] = useState("");
	const [clearer, setClearer] = useState("");
	const [groupName, setGroupName] = useState("");
	const [kind, setKind] = useState("course");
	const [expertEmail, setExpertEmail] = useState("");
	const [expertGroupId, setExpertGroupId] = useState("");
	const [schoolWide, setSchoolWide] = useState(false);
	const [uploadGroupId, setUploadGroupId] = useState("");
	const [file, setFile] = useState<string | null>(null);
	const [filename, setFilename] = useState("");
	const [notice, setNotice] = useState("");

	const [startConversation] = (useMutation as any)(START_SCHOOL_CONVERSATION);
	const [suggestWording] = (useMutation as any)(SUGGEST_QUESTION_WORDING);
	const [createGroup] = (useMutation as any)(CREATE_SCHOOL_GROUP);
	const [addExpert] = (useMutation as any)(ADD_EXPERT);
	const [uploadDocument] = (useMutation as any)(UPLOAD_SCHOOL_DOCUMENT);

	const groups = data?.schoolGroups || [];
	const expertGroups = data?.myExpertGroups || [];
	const canCreate = Boolean(data?.canCreateSchoolGroup);

	const showError = (err: any) => {
		setNotice(err?.message || t("An error occurred"));
	};

	return (
		<Stack spacing={3}>
			<Typography variant="h2">{t("coursesAndOffices")}</Typography>
			{error && <Alert severity="error">{error.message}</Alert>}
			{notice && <Alert severity="info" onClose={() => setNotice("")}>{notice}</Alert>}

			<Stack spacing={1}>
				<Typography variant="h3">{t("askQuestion")}</Typography>
				<TextField select label={t("coursesAndOffices")} value={groupId} onChange={(event) => setGroupId(event.target.value)}>
					{groups.map((group: any) => (
						<MenuItem key={group._id} value={group._id}>
							{group.name} ({t(group.kind)})
						</MenuItem>
					))}
				</TextField>
				<TextField multiline minRows={3} label={t("newMessage")} value={draft} onChange={(event) => setDraft(event.target.value)} />
				<Stack direction="row" spacing={1}>
					<Button
						variant="outlined"
						disabled={!groupId || !draft.trim()}
						onClick={async () => {
							try {
								const result = await suggestWording({variables: {groupId, draft}});
								setClearer(result.data.suggestQuestionWording);
							} catch (err) {
								showError(err);
							}
						}}
					>
						{t("makeClearer")}
					</Button>
					<Button
						variant="contained"
						disabled={!groupId || !draft.trim()}
						onClick={async () => {
							try {
								const result = await startConversation({variables: {groupId, body: draft}});
								navigate(`/chat/${result.data.startSchoolConversation._id}`);
							} catch (err) {
								showError(err);
							}
						}}
					>
						{t("sendMessage")}
					</Button>
				</Stack>
				{clearer && (
					<Alert
						severity="info"
						action={<Button color="inherit" onClick={() => { setDraft(clearer); setClearer(""); }}>{t("useThis")}</Button>}
					>
						{clearer}
					</Alert>
				)}
			</Stack>

			{canCreate && (
				<Stack spacing={1}>
					<Typography variant="h3">{t("createCourseOrOffice")}</Typography>
					<Stack direction="row" spacing={1}>
						<TextField label={t("name")} value={groupName} onChange={(event) => setGroupName(event.target.value)} />
						<TextField select label={t("kind")} value={kind} onChange={(event) => setKind(event.target.value)}>
							<MenuItem value="course">{t("course")}</MenuItem>
							<MenuItem value="office">{t("office")}</MenuItem>
						</TextField>
						<Button
							variant="contained"
							disabled={!groupName.trim()}
							onClick={async () => {
								try {
									await createGroup({variables: {name: groupName, kind}});
									setGroupName("");
									refetch();
								} catch (err) {
									showError(err);
								}
							}}
						>
							{t("createCourseOrOffice")}
						</Button>
					</Stack>
				</Stack>
			)}

			{expertGroups.length > 0 && (
				<Stack spacing={2}>
					<Typography variant="h3">{t("waitingQuestions")}</Typography>
					{expertGroups.map((group: any) => (
						<Stack key={group._id} spacing={1}>
							<Typography variant="h4">{group.name}</Typography>
							<WaitingList groupId={group._id} />
						</Stack>
					))}

					<Typography variant="h3">{t("addExpert")}</Typography>
					<Stack direction="row" spacing={1}>
						<TextField select label={t("coursesAndOffices")} value={expertGroupId} onChange={(event) => setExpertGroupId(event.target.value)}>
							{expertGroups.map((group: any) => (
								<MenuItem key={group._id} value={group._id}>{group.name}</MenuItem>
							))}
						</TextField>
						<TextField label={t("email")} value={expertEmail} onChange={(event) => setExpertEmail(event.target.value)} />
						<Button
							variant="contained"
							disabled={!expertGroupId || !expertEmail.trim()}
							onClick={async () => {
								try {
									await addExpert({variables: {groupId: expertGroupId, email: expertEmail}});
									setExpertEmail("");
									setNotice(t("addExpert") || "");
								} catch (err) {
									showError(err);
								}
							}}
						>
							{t("addExpert")}
						</Button>
					</Stack>

					<Typography variant="h3">{t("uploadDocument")}</Typography>
					<FormControlLabel
						control={<Checkbox checked={schoolWide} onChange={(event) => setSchoolWide(event.target.checked)} />}
						label={t("schoolWide")}
					/>
					{!schoolWide && (
						<TextField select label={t("coursesAndOffices")} value={uploadGroupId} onChange={(event) => setUploadGroupId(event.target.value)}>
							{expertGroups.map((group: any) => (
								<MenuItem key={group._id} value={group._id}>{group.name}</MenuItem>
							))}
						</TextField>
					)}
					<Button variant="outlined" component="label">
						{filename || t("uploadDocument")}
						<input
							hidden
							type="file"
							accept=".txt,.md,.pdf"
							onChange={(event) => {
								const chosen = event.target.files && event.target.files[0];
								if (!chosen) {
									return;
								}
								setFilename(chosen.name);
								const reader = new FileReader();
								reader.onloadend = () => setFile(String(reader.result || ""));
								reader.readAsDataURL(chosen);
							}}
						/>
					</Button>
					<Button
						variant="contained"
						disabled={!file || (!schoolWide && !uploadGroupId)}
						onClick={async () => {
							try {
								await uploadDocument({
									variables: {groupId: schoolWide ? null : uploadGroupId, schoolWide, filename, file},
								});
								setFile(null);
								setFilename("");
								setNotice(t("uploadDocument") || "");
							} catch (err) {
								showError(err);
							}
						}}
					>
						{t("uploadDocument")}
					</Button>
				</Stack>
			)}
		</Stack>
	);
};

export default SchoolHome;
