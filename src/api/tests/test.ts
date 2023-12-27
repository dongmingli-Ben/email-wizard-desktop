import { getMailboxInfoFromDB } from "../data/main";
import { query, updateValue } from "../data/utils";
import {
  handleAddMailbox,
  handleGetEvents,
  handleGetMailboxes,
  handleRemoveMailbox,
  handleUpdateEvents,
  handleUpdateMailbox,
  handleUpdateSettings,
} from "../main";
import { getLastEmailInfoByAddress, getNMailsByPolicy } from "../policy";
import { getSettings } from "../utils";
import { prepareTestDatabase } from "./prepare";

async function testMailbox(): Promise<void> {
  await prepareTestDatabase();
  let resp = await handleAddMailbox("gmail", "example.com", {});
  let mailboxes = await handleGetMailboxes();
  console.log(mailboxes);
  let errMsg = await handleUpdateMailbox("example.com", {
    access_token: "1234",
  });
  console.log(await handleGetMailboxes());
  errMsg = await handleRemoveMailbox("example.com");
  console.log(await handleGetMailboxes());
}

async function testEvents(): Promise<void> {
  await prepareTestDatabase();
  let resp = await handleUpdateEvents("example@gmail.com");
  if (resp.retrievalErrorMsg != "" || resp.parseErrorMsg != "") {
    console.log(resp);
  }
  console.log(await handleGetEvents());
  await handleRemoveMailbox("example@gmail.com");
  console.log(await handleGetEvents());
}

async function testPolicy(): Promise<void> {
  await prepareTestDatabase();
  console.log(getPolicy());
  let mailboxes = await handleGetMailboxes();
  if (!Array.isArray(mailboxes)) {
    throw mailboxes;
  }
  let mailbox = await getMailboxInfoFromDB(mailboxes[0].username);
  let n = await getNMailsByPolicy(getPolicy(), mailbox);
  console.log(n);

  await handleUpdateSettings({
    emailReadPolicy: JSON.stringify({
      policy: "last-n-days",
      n: 7,
    }),
  });
  n = await getNMailsByPolicy(getPolicy(), mailbox);
  console.log(n);

  await handleUpdateSettings({
    emailReadPolicy: JSON.stringify({
      policy: "all-since-last-parse",
      first_parse_policy: {
        policy: "last-n-days",
        n: 7,
      },
    }),
  });
  n = await getNMailsByPolicy(getPolicy(), mailbox);
  console.log(n);

  updateValue(
    "last_email_info",
    JSON.stringify({ emailId: "123", timestamp: new Date("2023-12-22") }),
    { address: mailbox.address },
    "mailboxes"
  );
  n = await getNMailsByPolicy(getPolicy(), mailbox);
  console.log(n);

  await handleUpdateSettings({ apiKey: process.env.OPENAI_API_KEY });
  await handleUpdateEvents(mailbox.address);
  console.log(getLastEmailInfoByAddress(mailbox.address));
  n = await getNMailsByPolicy(getPolicy(), mailbox);
  console.log(n);
}

function getPolicy() {
  // console.log(getSettings(["emailReadPolicy"]));
  // console.log(query(["value"], {}, "settings"));
  return JSON.parse(getSettings(["emailReadPolicy"]).emailReadPolicy);
}

// testMailbox();
// testEvents();
testPolicy();
