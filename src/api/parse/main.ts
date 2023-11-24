import { getPrompt } from "./prompt";
import { extractJSON, getLLMResponse } from "./utils";

type StringMap = { [key: string]: string };
type StringKeyMap = { [key: string]: any };

export async function parseEmail(
  email: StringMap,
  apiKey: string,
  maxPatience: number = 5,
  kwargs: StringMap
): Promise<StringMap[]> {
  let prompt = getPrompt(email, kwargs);
  for (let i = 0; i < maxPatience; i++) {
    try {
      let rawResult = await getLLMResponse(prompt, apiKey);
      let result = extractJSON(rawResult);
      return result;
    } catch (err) {
      console.log("Error when parsing email: " + err.toString());
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return [];
}
