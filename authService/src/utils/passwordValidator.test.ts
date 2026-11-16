const test = require("node:test");
const assert = require("node:assert/strict");
const {validatePassword} = require("./passwordValidator");

test("rejects a password shorter than 6 characters", () => {
	const result = validatePassword("abc");
	assert.equal(result.isValid, false);
});

test("accepts a password of 6 to 16 characters", () => {
	assert.equal(validatePassword("secret").isValid, true);
	assert.equal(validatePassword("secret1234567890").isValid, true);
});
