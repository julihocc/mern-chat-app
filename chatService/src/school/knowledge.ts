const STOP = new Set([
	"the", "and", "for", "with", "that", "this", "from", "your", "have", "what",
	"when", "where", "which", "about", "para", "con", "los", "las", "una", "uno",
	"que", "del", "por", "como", "esta", "este",
]);

function tokens(text: string) {
	return String(text || "")
		.toLowerCase()
		.split(/[^a-z0-9áéíóúüñ]+/i)
		.filter((token) => token.length >= 3 && !STOP.has(token));
}

function excerptsForGroup(groupId: any, chunks: any[], markedAnswers: any[]) {
	const group = String(groupId);
	const fromChunks = (chunks || [])
		.filter((chunk) => chunk.scope === "school" || String(chunk.groupId) === group)
		.map((chunk) => ({text: chunk.text, source: "document"}));
	const fromAnswers = (markedAnswers || [])
		.filter((answer) => String(answer.groupId) === group)
		.map((answer) => ({
			text: `Question: ${answer.questionText}\nAnswer: ${answer.answerText}`,
			source: "marked-answer",
		}));
	return [...fromChunks, ...fromAnswers];
}

function rankExcerpts(query: string, excerpts: any[]) {
	const wanted = new Set(tokens(query));
	if (wanted.size === 0) {
		return [];
	}
	const ranked = (excerpts || [])
		.map((excerpt) => {
			const seen = new Set(tokens(excerpt.text));
			let score = 0;
			for (const token of wanted) {
				if (seen.has(token)) {
					score += 1;
				}
			}
			return {...excerpt, score};
		})
		.filter((excerpt) => excerpt.score > 0)
		.sort((left, right) => right.score - left.score);

	const chosen = [];
	let chars = 0;
	for (const excerpt of ranked) {
		if (chosen.length >= 8) {
			break;
		}
		const text = String(excerpt.text).slice(0, 1200);
		if (chars + text.length > 8000) {
			break;
		}
		chosen.push({text, source: excerpt.source});
		chars += text.length;
	}
	return chosen;
}

function chunkText(text: string) {
	const clean = String(text || "").replace(/\r\n/g, "\n").trim();
	if (!clean) {
		return [];
	}
	const parts = clean.split(/\n{2,}/);
	const chunks: string[] = [];
	let current = "";
	for (const part of parts) {
		const piece = part.trim();
		if (!piece) {
			continue;
		}
		if ((current + "\n\n" + piece).trim().length > 1000) {
			if (current) {
				chunks.push(current.trim());
			}
			current = piece.length > 1000 ? piece.slice(0, 1000) : piece;
		} else {
			current = current ? `${current}\n\n${piece}` : piece;
		}
	}
	if (current.trim()) {
		chunks.push(current.trim());
	}
	return chunks;
}

module.exports = {excerptsForGroup, rankExcerpts, chunkText};
