const OpenAI = require("openai");

async function complete(built: {instructions: string; input: string}) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) {
		throw new Error("XAI_API_KEY is not set on the gateway");
	}
	const client = new OpenAI({
		apiKey,
		baseURL: "https://api.x.ai/v1",
	});
	const response = await client.responses.create({
		model: "grok-4.7",
		instructions: built.instructions,
		input: built.input,
	});
	const text = response.output_text || "";
	if (!text.trim()) {
		throw new Error("The model returned an empty reply");
	}
	return text.trim();
}

module.exports = {complete};
