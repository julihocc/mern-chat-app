function internalApiToken() {
	return process.env.INTERNAL_API_TOKEN || "dev-internal-token";
}

module.exports = {internalApiToken};
