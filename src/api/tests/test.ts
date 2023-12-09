import {
  handleAddMailbox,
  handleGetEvents,
  handleGetMailboxes,
  handleRemoveMailbox,
  handleUpdateEvents,
  handleUpdateMailbox,
} from "../main";
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
  let errMsg = await handleUpdateEvents("example@gmail.com");
  if (errMsg != "") {
    console.log(errMsg);
  }
  console.log(await handleGetEvents());
  await handleRemoveMailbox("example@gmail.com");
  console.log(await handleGetEvents());
}

testMailbox();
// testEvents();
