import { addEventsInDB, getMailboxInfoFromDB } from "./data/main";
import { query, updateValue } from "./data/utils";
import {
  refreshGmailCredentials,
  revokeGmailCredentials,
} from "./mailbox/gmail";
import { refreshOutlookCredentials } from "./mailbox/outlook";
import { parseEmail } from "./parse/main";

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

export async function tryParseErrorEmails(address: string): Promise<string> {
  let apiKey = await getApiKey();
  let data = query(
    ["email_id", "email_content"],
    { email_address: address, parsed: 0 },
    "emails"
  );
  console.log("emails in error", data.length);
  try {
    await Promise.all(
      data.map(async (item: any) => {
        let events = await parseEmail(
          JSON.parse(item.email_content),
          apiKey,
          5,
          {}
        );
        await addEventsInDB(events, item.email_id, address);
        updateValue(
          "parsed",
          1,
          { email_id: item.email_id, email_address: address },
          "emails"
        );
        updateValue(
          "email_content",
          "",
          { email_id: item.email_id, email_address: address },
          "emails"
        );
      })
    );
  } catch (e) {
    return e.message;
  }
  return "";
}

type StringMap = { [key: string]: string };
type StringKeyMap = { [key: string]: any };
