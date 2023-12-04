import { addEventsInDB, getMailboxInfoFromDB } from "./data/main";
import { addRow, deleteRows, query, updateValue } from "./data/utils";
import { retrieveEmails } from "./email/main";
import { parseEmail } from "./parse/main";
import { getApiKey } from "./utils";

type StringMap = { [key: string]: string };
type StringKeyMap = { [key: string]: any };

const N_MAILS = 25;

export async function handleGetEvents(): Promise<StringMap[] | StringKeyMap> {
  try {
    let results = query(["*"], {}, "events");
    let events: StringMap[] = [];
    for (let row of results) {
      events.push(JSON.parse(row.event_content));
    }
    return events;
  } catch (e) {
    console.log(e);
    return { errMsg: e.message };
  }
}

export async function handleUpdateEvents(
  address: string,
  kwargs: StringMap = {}
): Promise<string> {
  let errMsg = "";
  try {
    let mailbox = await getMailboxInfoFromDB(address);
    let emails = await retrieveEmails(
      mailbox.address,
      mailbox.protocol,
      mailbox.credentials,
      N_MAILS
    );
    await Promise.all(
      emails.map(async ([id, email]) => {
        let result = query(["*"], { email_id: id }, "emails");
        if (result.length > 0) {
          return;
        }
        addRow(
          {
            email_id: id,
            email_address: address,
            event_ids: [],
          },
          "emails"
        );
        let events = await parseEmail(email, await getApiKey(), 5, kwargs);
        await addEventsInDB(events, id, address);
      })
    );
  } catch (e) {
    console.log(e);
    errMsg = e.message;
  }
  return errMsg;
}

/**
 * Verify whether we can access the mailbox with the given credentials.
 * @param req add mailbox request
 * @returns the credentials of the mailbox if the mailbox is successfully added, otherwise an error message
 */
export async function handleVerifyMailbox(
  req: StringMap
): Promise<StringKeyMap> {
  return {};
}

export async function handleGetMailboxes(): Promise<
  StringMap[] | StringKeyMap
> {
  try {
    let result = query(["*"], {}, "mailboxes");
    let mailboxes: StringMap[] = [];
    for (let row of result) {
      mailboxes.push({
        username: row.address,
        protocol: row.protocol,
        credentials: JSON.parse(row.credentials),
      });
    }
    return mailboxes;
  } catch (e) {
    console.log(e);
    return { errMsg: e.message };
  }
}

export async function handleAddMailbox(
  type: string,
  address: string,
  credentials: StringMap
): Promise<StringKeyMap> {
  let errMsg = "";
  try {
    addRow(
      {
        address: address,
        protocol: type,
        credentials: credentials,
      },
      "mailboxes"
    );
  } catch (e) {
    console.log(e);
    errMsg = e.message;
  }
  return { errMsg: errMsg };
}

export async function handleRemoveMailbox(address: string): Promise<string> {
  try {
    deleteRows({ email_address: address }, "events");
    deleteRows({ email_address: address }, "emails");
    deleteRows({ address: address }, "mailboxes");
    return "";
  } catch (e) {
    console.log(e);
    return e.message;
  }
}

export async function handleUpdateMailbox(
  address: string,
  credentials: StringMap
): Promise<string> {
  try {
    updateValue("credentials", credentials, { address: address }, "mailboxes");
    return "";
  } catch (e) {
    console.log(e);
    return e.message;
  }
}
