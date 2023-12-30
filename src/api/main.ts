import { shell } from "electron";
import { addEventsInDB, getMailboxInfoFromDB } from "./data/main";
import { addRow, deleteRows, query, updateValue } from "./data/utils";
import { retrieveEmails } from "./email/main";
import { parseEmail } from "./parse/main";
import {
  getApiKey,
  getSettings,
  refreshCredentialsIfExpire,
  revokeMailboxCredentials,
  tryParseErrorEmails,
} from "./utils";
import { getNMailsByPolicy } from "./policy";

type StringMap = { [key: string]: string };
type StringKeyMap = { [key: string]: any };

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
): Promise<StringMap> {
  let emails: [string, StringKeyMap][] = [];
  let parseErrorMsg = await tryParseErrorEmails(address);
  if (parseErrorMsg !== "") {
    return {
      retrievalErrorMsg: "",
      parseErrorMsg: parseErrorMsg,
    };
  }
  try {
    await refreshCredentialsIfExpire(address);
    let mailbox = await getMailboxInfoFromDB(address);
    let policy = JSON.parse(getSettings(["emailReadPolicy"]).emailReadPolicy);
    let nMails = await getNMailsByPolicy(policy, mailbox);
    console.log(`retrieving ${nMails} emails for address: ` + address);
    emails = await retrieveEmails(
      mailbox.address,
      mailbox.protocol,
      mailbox.credentials,
      nMails
    );
    console.log(`retrieved ${emails.length} emails for address: ` + address);
  } catch (e) {
    console.log("error in retrieving emails for address: " + address);
    console.log(e);
    return {
      retrievalErrorMsg: e.message,
      parseErrorMsg: "",
    };
  }
  try {
    let lastEmailInfo: EmailInfo = null;
    await Promise.all(
      emails.map(async ([id, email]) => {
        let result = query(["*"], { email_id: id }, "emails");
        if (result.length > 0) {
          return;
        }
        try {
          console.log(`parsing email: ${id}, address: ${address}`);
          let events = await parseEmail(email, await getApiKey(), 5, kwargs);
          console.log(`storing ${events.length} events for email: ${id}`);
          // assuming adding email will not fail
          addRow(
            {
              email_id: id,
              email_address: address,
              event_ids: [],
              parsed: 1,
            },
            "emails"
          );
          await addEventsInDB(events, id, address);
        } catch (e) {
          console.log("error in parsing email: " + id);
          console.log(e);
          parseErrorMsg = e.message;
          // try to add the email as a email with error
          // the try catch is necessary because the email might be added
          // in another call of handleUpdateEvents
          try {
            addRow(
              {
                email_id: id,
                email_address: address,
                event_ids: [],
                parsed: 0,
                email_content: JSON.stringify(email),
              },
              "emails"
            );
          } catch (e) {
            console.log("error in adding email with error: " + id);
            console.log(e);
            console.log("skipping email: " + id);
          }
        }
        if (
          lastEmailInfo === null ||
          lastEmailInfo.timestamp < new Date(email.date)
        ) {
          lastEmailInfo = {
            emailId: id,
            timestamp: new Date(email.date),
          };
        }
      })
    );
    console.log("handleUpdateEvents", lastEmailInfo);
    if (lastEmailInfo !== null) {
      updateValue(
        "last_email_info",
        JSON.stringify(lastEmailInfo),
        { address: address },
        "mailboxes"
      );
    }
  } catch (e) {
    console.log("error in parsing for address: " + address);
    console.log(e);
    return {
      retrievalErrorMsg: "",
      parseErrorMsg: e.message,
    };
  }
  return {
    retrievalErrorMsg: "",
    parseErrorMsg: parseErrorMsg,
  };
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
        lastEmailInfo: JSON.parse(row.last_email_info),
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
): Promise<string> {
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
  return errMsg;
}

export async function handleRemoveMailbox(address: string): Promise<string> {
  try {
    await revokeMailboxCredentials(address);
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

export function handleOpenURLInBrowser(url: string): void {
  shell.openExternal(url);
}

export async function handleUpdateSettings(req: StringMap): Promise<string> {
  try {
    for (let key in req) {
      updateValue("value", req[key], { key: key }, "settings");
    }
    return "";
  } catch (e) {
    console.log(e);
    return e.message;
  }
}

export async function handleGetSettings(): Promise<StringKeyMap> {
  try {
    let result = getSettings();
    let settings = {
      ...result,
      emailReadPolicy: JSON.parse(result.emailReadPolicy),
    };
    return settings;
  } catch (e) {
    console.log(e);
    return { errMsg: e.message };
  }
}

type EmailInfo = {
  emailId: string;
  timestamp: Date;
};
