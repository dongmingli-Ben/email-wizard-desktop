import { getMailboxInfoFromDB } from "./data/main";
import { query } from "./data/utils";
import {
  refreshGmailCredentials,
  revokeGmailCredentials,
} from "./mailbox/gmail";
import { refreshOutlookCredentials } from "./mailbox/outlook";

export async function getApiKey(): Promise<string> {
  let data = query(["value"], { key: "apiKey" }, "settings");
  return data[0].value;
}

export async function refreshCredentialsIfExpire(address: string) {
  let mailbox = await getMailboxInfoFromDB(address);
  if (mailbox.protocol === "gmail") {
    await refreshGmailCredentials(address, mailbox.credentials);
  } else if (mailbox.protocol === "outlook") {
    await refreshOutlookCredentials(address, mailbox.credentials);
  }
}

export async function revokeMailboxCredentials(address: string) {
  let mailbox = await getMailboxInfoFromDB(address);
  if (mailbox.protocol === "gmail") {
    await revokeGmailCredentials(address, mailbox.credentials);
  }
}
