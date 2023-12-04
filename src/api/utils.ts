export async function getApiKey(): Promise<string> {
  let key = process.env.OPENAI_API_KEY || "";
  if (key === "") {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return key;
}
