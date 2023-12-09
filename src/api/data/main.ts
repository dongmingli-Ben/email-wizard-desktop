import assert from "assert";
import { addRow, query, updateValue } from "./utils";

type StringKeyMap = { [key: string]: any };
type StringMap = { [key: string]: string };

type MailboxInfo = {
  address: string;
  protocol: string;
  credentials: StringMap;
};

export async function getMailboxInfoFromDB(
  address: string
): Promise<MailboxInfo> {
  let result = query(
    ["address", "protocol", "credentials"],
    { address: address },
    "mailboxes"
  );
  assert(result.length == 1, `find ${result.length} mailboxes`);
  return {
    address: result[0].address,
    protocol: result[0].protocol,
    credentials: JSON.parse(result[0].credentials),
  };
}

export async function addEmailsInDB(
  address: string,
  emails: [string, StringMap][]
): Promise<void> {
  for (let [id, email] of emails) {
    addRow(
      {
        email_id: id,
        email_address: address,
        event_ids: [],
      },
      "emails"
    );
  }
}

export async function addEventsInDB(
  events: StringMap[],
  emailId: string,
  address: string
): Promise<void> {
  let event_ids: any[] = [];
  for (let event of events) {
    let result = addRow(
      {
        email_id: emailId,
        email_address: address,
        event_content: event,
      },
      "events"
    );
    event_ids.push(result.lastInsertRowid);
  }
  let result = query(["event_ids"], { email_id: emailId }, "emails");
  assert(result.length == 1, `find ${result.length} emails`);
  let oldEventIds = JSON.parse(result[0].event_ids);
  let newEventIds = oldEventIds.concat(event_ids);
  updateValue(
    "event_ids",
    newEventIds,
    { email_id: emailId, email_address: address },
    "emails"
  );
}
