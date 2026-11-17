const test = require("node:test");
const assert = require("node:assert/strict");
const {buildRephraseInput, buildReplyInput} = require("./prompts");

test("a rephrase prompt contains the draft and the group name, and no school fact", () => {
	const secret = "The library closes at 18:00.";
	const built = buildRephraseInput("When does the library close?", "Algebra");
	assert.match(built.input, /When does the library close/);
	assert.match(built.input, /Algebra/);
	assert.equal(built.input.includes(secret), false);
	assert.match(built.instructions, /Do not add facts/);
});

test("a reply prompt is skipped when there are no excerpts", () => {
	assert.equal(buildReplyInput([{author: "student", body: "When is the exam?"}], []), null);
});

test("a reply prompt is limited to the conversation and the excerpts", () => {
	const built = buildReplyInput(
		[{author: "student", body: "When is the exam?"}],
		[{text: "The exam is on Friday."}],
	);
	assert.match(built.instructions, /Use only the supplied excerpts/);
	assert.match(built.input, /When is the exam/);
	assert.match(built.input, /The exam is on Friday/);
});
