import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable.");
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }

  return openaiClient;
}

export async function generatePrayerSummary(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return prompt;
  }

  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  });

  return response.choices[0]?.message.content ?? "";
}

export async function fixGrammar(requests: string[]): Promise<string[]> {
  if (requests.length === 0) return [];

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return requests;
  }

  const prompt = `You are cleaning up prayer request entries for a church bulletin.
Fix spelling, capitalization, and grammar for each item below.
Keep the meaning exactly the same. Keep each item short (do not expand into full sentences).
Return ONLY a JSON array of strings, in the same order, with no extra text and no markdown formatting.

Items:
${requests.map((request, index) => `${index + 1}. ${request}`).join("\n")}`;

  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  const text = (response.choices[0]?.message.content ?? "[]").trim();

  try {
    const cleaned = JSON.parse(text.replace(/^```json\s*|```$/g, ""));

    if (Array.isArray(cleaned) && cleaned.length === requests.length) {
      return cleaned as string[];
    }
  } catch (error) {
    console.error("Failed to parse grammar-fix response:", error);
  }

  return requests;
}

export async function detectGenders(
  names: string[]
): Promise<Record<string, "Male" | "Female">> {
  if (names.length === 0) return {};

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Default to Male if no API key
    return Object.fromEntries(names.map((name) => [name, "Male"]));
  }

  const prompt = `Detect the likely gender of each full name below. Return a JSON object with the exact full name as keys and either "Male" or "Female" as values.
If a name includes a title like Bro, Brother, Sis, or Sister, ignore that title and infer from the actual personal name. Use common English name conventions, and if unsure, make your best guess.
Return ONLY valid JSON with no additional text, no markdown, and no explanation.

Names:
${names.map((name) => `- ${name}`).join("\n")}`;

  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    const text = (response.choices[0]?.message.content ?? "{}").trim();
    const genders = JSON.parse(text.replace(/^```json\s*|```$/g, ""));

    // Ensure all names have a gender (default to Male if missing)
    const result: Record<string, "Male" | "Female"> = {};
    for (const name of names) {
      result[name] =
        genders[name] === "Female" ? "Female" : ("Male" as const);
    }

    return result;
  } catch (error) {
    console.error("Failed to detect genders:", error);
    // Default to Male for all names if detection fails
    return Object.fromEntries(names.map((name) => [name, "Male"]));
  }
}
