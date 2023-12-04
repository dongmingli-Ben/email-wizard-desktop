import { getMailboxInfoFromDB } from "./data/main";
import { refreshGmailCredentials } from "./mailbox/gmail";
import { refreshOutlookCredentials } from "./mailbox/outlook";

export async function getApiKey(): Promise<string> {
  let key = process.env.OPENAI_API_KEY || "";
  if (key === "") {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return key;
}

export async function refreshCredentialsIfExpire(address: string) {
  let mailbox = await getMailboxInfoFromDB(address);
  if (mailbox.protocol === "gmail") {
    await refreshGmailCredentials(address, mailbox.credentials);
  } else if (mailbox.protocol === "outlook") {
    await refreshOutlookCredentials(address, mailbox.credentials);
  }
}
