const test = require("node:test");
const assert = require("node:assert/strict");
const {excerptsForGroup, rankExcerpts, chunkText} = require("./knowledge");

test("search keeps this group's material and school-wide documents, and drops other groups", () => {
	const excerpts = excerptsForGroup(
		"algebra",
		[
			{scope: "group", groupId: "algebra", text: "Homework is due Monday."},
			{scope: "group", groupId: "biology", text: "The lab is in room 2."},
			{scope: "school", groupId: null, text: "The library closes at 18:00."},
		],
		[
			{groupId: "algebra", questionText: "When is homework due?", answerText: "Monday."},
			{groupId: "biology", questionText: "Where is the lab?", answerText: "Room 2."},
		],
	);
	const text = excerpts.map((excerpt: any) => excerpt.text).join("\n");
	assert.match(text, /Homework is due Monday/);
	assert.match(text, /library closes/);
	assert.match(text, /When is homework due/);
	assert.equal(text.includes("room 2"), false);
	assert.equal(text.includes("Where is the lab"), false);
});

test("a question with no shared words returns nothing", () => {
	const excerpts = rankExcerpts("tuition payment", [
		{text: "The library closes at 18:00.", source: "document"},
	]);
	assert.deepEqual(excerpts, []);
});

test("a question returns the matching excerpt", () => {
	const excerpts = rankExcerpts("library hours", [
		{text: "The library closes at 18:00.", source: "document"},
		{text: "Bring a pencil to the exam.", source: "document"},
	]);
	assert.equal(excerpts.length, 1);
	assert.match(excerpts[0].text, /library closes/);
});

test("chunking keeps paragraph text and drops empty input", () => {
	assert.deepEqual(chunkText("   "), []);
	const chunks = chunkText("First paragraph.\n\nSecond paragraph.");
	assert.equal(chunks.length, 1);
	assert.match(chunks[0], /First paragraph/);
	assert.match(chunks[0], /Second paragraph/);
});
