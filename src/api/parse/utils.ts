import OpenAI from "openai";

type StringMap = { [key: string]: string };
type StringKeyMap = { [key: string]: any };

export async function getLLMResponse(
  prompt: string,
  apiKey: string
): Promise<string> {
  const openai = new OpenAI({ apiKey });
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
  });
  return chatCompletion.choices[0].message.content;
}

export function extractJSON(rawResult: string): StringMap[] {
  const pattern = /\{.*"events":.*\[.*\].*\}/gs; // Added 's' flag for dot to match newline
  const matches = rawResult.match(pattern) || [];
  const sortedMatches = matches.sort((a, b) => b.length - a.length);

  for (const match of sortedMatches) {
    try {
      const result = JSON.parse(match);
      return result.events;
    } catch (error) {
      continue;
    }
  }

  throw new Error(
    `API's result does not contain a valid JSON object, returned: ${rawResult}`
  );
}
