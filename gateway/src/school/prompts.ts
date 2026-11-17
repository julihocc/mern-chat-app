function buildRephraseInput(draft: string, groupName: string) {
	return {
		instructions: [
			"Rewrite the student's draft so it is clearer.",
			"Do not add facts, answers, or school policy.",
			"Do not mention documents or earlier cases.",
			"Keep the language of the draft.",
			"Return only the rewritten draft.",
		].join(" "),
		input: `Group name: ${groupName}\nDraft:\n${draft}`,
	};
}

function buildReplyInput(messages: any[], excerpts: any[]) {
	if (!Array.isArray(excerpts) || excerpts.length === 0) {
		return null;
	}
	const transcript = (messages || [])
		.map((message) => `${message.author || "person"}: ${message.body || ""}`)
		.join("\n");
	const material = excerpts.map((excerpt, index) => `Excerpt ${index + 1}:\n${excerpt.text}`).join("\n\n");
	return {
		instructions: [
			"Draft a reply the expert might send to the student.",
			"Use only the supplied excerpts.",
			"Do not use outside knowledge of the school.",
			"If the excerpts do not cover the question, say what they do not cover.",
			"Write in the language of the student's messages.",
			"Return only the proposed reply.",
		].join(" "),
		input: `Conversation:\n${transcript}\n\nExcerpts:\n${material}`,
	};
}

module.exports = {buildRephraseInput, buildReplyInput};
