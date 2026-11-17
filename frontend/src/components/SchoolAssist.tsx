import React, {useState} from "react";
import {Alert, Button, Stack, Typography} from "@mui/material";
import {useMutation} from "@apollo/client/react";
import {useTranslation} from "react-i18next";
import {MARK_ANSWER, SUGGEST_QUESTION_WORDING, SUGGEST_REPLY} from "../gql/school";

const SchoolAssist = ({
	chatRoomId,
	groupId,
	expertId,
	currentUserId,
	draft,
	setDraft,
	messages,
}: any) => {
	const {t} = useTranslation();
	const [clearer, setClearer] = useState("");
	const [proposal, setProposal] = useState("");
	const [excerpts, setExcerpts] = useState<string[]>([]);
	const [nothing, setNothing] = useState(false);
	const [notice, setNotice] = useState("");
	const [suggestWording] = (useMutation as any)(SUGGEST_QUESTION_WORDING);
	const [suggestReply] = (useMutation as any)(SUGGEST_REPLY);
	const [markAnswer] = (useMutation as any)(MARK_ANSWER);

	if (!groupId) {
		return null;
	}

	const isExpert = expertId && String(expertId) === String(currentUserId);

	return (
		<Stack spacing={1} sx={{my: 2}}>
			{notice && <Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert>}
			{!isExpert && (
				<Button
					variant="outlined"
					disabled={!draft.trim()}
					onClick={async () => {
						const result = await suggestWording({variables: {groupId, draft}});
						setClearer(result.data.suggestQuestionWording);
					}}
				>
					{t("makeClearer")}
				</Button>
			)}
			{clearer && (
				<Alert severity="info" action={<Button color="inherit" onClick={() => { setDraft(clearer); setClearer(""); }}>{t("useThis")}</Button>}>
					{clearer}
				</Alert>
			)}
			{isExpert && (
				<Button
					variant="outlined"
					onClick={async () => {
						const result = await suggestReply({variables: {chatRoomId}});
						const suggestion = result.data.suggestReply;
						setNothing(suggestion.nothingToSuggest);
						setProposal(suggestion.proposal || "");
						setExcerpts(suggestion.excerpts || []);
					}}
				>
					{t("suggestReply")}
				</Button>
			)}
			{nothing && <Alert severity="warning">{t("nothingToSuggest")}</Alert>}
			{proposal && (
				<Alert severity="info" action={<Button color="inherit" onClick={() => setDraft(proposal)}>{t("useThis")}</Button>}>
					<Typography>{proposal}</Typography>
					{excerpts.map((excerpt) => (
						<Typography key={excerpt} variant="caption" display="block">{excerpt}</Typography>
					))}
				</Alert>
			)}
			{isExpert && messages && messages.filter((message: any) => String(message.senderId?._id || message.senderId) === String(currentUserId)).map((message: any) => (
				<Button
					key={message._id}
					size="small"
					onClick={async () => {
						await markAnswer({variables: {messageId: message._id}});
						setNotice(t("keepThisAnswer") || "");
					}}
				>
					{t("keepThisAnswer")}: {message.body}
				</Button>
			))}
		</Stack>
	);
};

export default SchoolAssist;
