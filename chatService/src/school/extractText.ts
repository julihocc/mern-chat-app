const MAX_BYTES = 5 * 1024 * 1024;

async function extractText(filename: string, base64: string) {
	const buffer = Buffer.from(base64 || "", "base64");
	if (!buffer.length || buffer.length > MAX_BYTES) {
		throw new Error("The file must contain text and be 5 MB or smaller");
	}
	const lower = String(filename || "").toLowerCase();
	let text = "";
	if (lower.endsWith(".txt") || lower.endsWith(".md")) {
		text = buffer.toString("utf8");
	} else if (lower.endsWith(".pdf")) {
		const pdfParse = require("pdf-parse/lib/pdf-parse.js");
		const parsed = await pdfParse(buffer);
		text = parsed.text || "";
	} else {
		throw new Error("Only .txt, .md, and .pdf files are accepted");
	}
	if (!String(text).trim()) {
		throw new Error("No text could be read from this file");
	}
	return String(text).trim();
}

module.exports = {extractText, MAX_BYTES};
