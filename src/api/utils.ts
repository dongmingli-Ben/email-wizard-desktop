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

/**
 * Query the setting values for given attributes
 * @param keys an array of attributes names to query
 * @returns An object with keys being the attribute names and values being attribute values.
 *  Note that JSON strings will not be parsed into objects.
 */
export function getSettings(keys: string[] = []): StringKeyMap {
  let data = query(["key", "value"], {}, "settings");
  let settings: StringKeyMap = {};
  for (let item of data) {
    if (keys.length === 0 || keys.includes(item.key)) {
      settings[item.key] = item.value;
    }
  }
  return settings;
}

type StringMap = { [key: string]: string };
type StringKeyMap = { [key: string]: any };
