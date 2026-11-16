function cookiesFromHeader(header: any) {
	const cookies: Record<string, string> = {};
	if (!header) {
		return cookies;
	}
	for (const part of header.split(";")) {
		const index = part.indexOf("=");
		if (index === -1) {
			continue;
		}
		const name = part.slice(0, index).trim();
		const value = decodeURIComponent(part.slice(index + 1).trim());
		if (name) {
			cookies[name] = value;
		}
	}
	return cookies;
}

function asBearer(value: any) {
	const trimmed = String(value).trim();
	if (!trimmed) {
		return "";
	}
	return /^bearer\s+/i.test(trimmed) ? trimmed : `Bearer ${trimmed}`;
}

function tokenFromRequest(req: any) {
	if (!req) {
		return "";
	}
	const cookies = req.cookies || cookiesFromHeader(req.headers && req.headers.cookie);
	if (cookies.authToken) {
		return asBearer(cookies.authToken);
	}
	const header = (req.headers && req.headers.authorization) || "";
	if (header) {
		return asBearer(header);
	}
	return "";
}

module.exports = {tokenFromRequest};
