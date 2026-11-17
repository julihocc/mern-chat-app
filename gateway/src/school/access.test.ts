const test = require("node:test");
const assert = require("node:assert/strict");
const {
	canCreateGroup,
	canAddExpert,
	canUploadGroupDocument,
	canUploadSchoolDocument,
	canSeeWaiting,
	canTake,
	canReadRoom,
	canProposeReply,
	canMark,
} = require("./access");

const student = {userId: "student-1", email: "student@school.test", expertGroupIds: []};
const algebraExpert = {userId: "expert-1", email: "profe@school.test", expertGroupIds: ["algebra"]};
const officeExpert = {userId: "expert-2", email: "admin@school.test", expertGroupIds: ["office"]};

test("a student cannot create a group unless their email is the bootstrap expert", () => {
	assert.equal(canCreateGroup(student, "profe@school.test"), false);
	assert.equal(canCreateGroup({...student, email: "Profe@school.test"}, "profe@school.test"), true);
	assert.equal(canCreateGroup(algebraExpert, ""), true);
});

test("only an expert of that group can add an expert or upload a group document", () => {
	assert.equal(canAddExpert(algebraExpert, "algebra"), true);
	assert.equal(canAddExpert(officeExpert, "algebra"), false);
	assert.equal(canAddExpert(student, "algebra"), false);
	assert.equal(canUploadGroupDocument(algebraExpert, "algebra"), true);
	assert.equal(canUploadGroupDocument(officeExpert, "algebra"), false);
});

test("school-wide documents are limited to experts", () => {
	assert.equal(canUploadSchoolDocument(student), false);
	assert.equal(canUploadSchoolDocument(algebraExpert), true);
});

test("waiting questions are visible only to experts of that group, and only while waiting", () => {
	assert.equal(canSeeWaiting(algebraExpert, "algebra"), true);
	assert.equal(canSeeWaiting(officeExpert, "algebra"), false);
	assert.equal(canSeeWaiting(student, "algebra"), false);
	assert.equal(canTake(algebraExpert, "algebra", "waiting"), true);
	assert.equal(canTake(algebraExpert, "algebra", "active"), false);
	assert.equal(canTake(student, "algebra", "waiting"), false);
});

test("room messages stay with the participants", () => {
	assert.equal(canReadRoom(student, ["student-1"]), true);
	assert.equal(canReadRoom(officeExpert, ["student-1", "expert-1"]), false);
});

test("only the expert who took the room can receive a reply proposal", () => {
	const room = {
		groupId: "algebra",
		status: "active",
		expertId: "expert-1",
		participantIds: ["student-1", "expert-1"],
	};
	assert.equal(canProposeReply(algebraExpert, room), true);
	assert.equal(canProposeReply(student, room), false);
	assert.equal(canProposeReply(officeExpert, room), false);
	assert.equal(canProposeReply(algebraExpert, {...room, status: "waiting", expertId: null, participantIds: ["student-1"]}), false);
});

test("only the sender can mark their own answer", () => {
	assert.equal(canMark(algebraExpert, "expert-1"), true);
	assert.equal(canMark(algebraExpert, "student-1"), false);
	assert.equal(canMark(student, "expert-1"), false);
});
