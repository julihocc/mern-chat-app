const crypto = require("crypto");

function tokensMatch(received: any, expected: any) {
	const left = Buffer.from(received || "");
	const right = Buffer.from(expected);
	if (left.length !== right.length) {
		return false;
	}
	return crypto.timingSafeEqual(left, right);
}

function requireInternalToken(req: any, res: any, next: any) {
	const expected = process.env.INTERNAL_API_TOKEN || "dev-internal-token";
	if (!tokensMatch(req.get("x-internal-token"), expected)) {
		return res.status(401).json({message: "Unauthorized"});
	}
	next();
}

module.exports = requireInternalToken;
