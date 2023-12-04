import { initDatabase } from "../init";
import { addRow, query } from "../utils";
import { addEmailsInDB, addEventsInDB, getMailboxInfoFromDB } from "../main";

type StringKeyMap = { [key: string]: any };
type StringMap = { [key: string]: string };

async function testAPI(): Promise<void> {
  initDatabase(true);
  addRow(
    {
      address: "example.com",
      protocol: "imap",
      credentials: {},
    },
    "mailboxes"
  );
  let result = await getMailboxInfoFromDB("example.com");
  console.log(result);
  let emails: [string, StringMap][] = [
    [
      "1234",
      {
        subject: "test",
      },
    ],
  ];
  await addEmailsInDB("example.com", emails);
  let events = [
    {
      event_type: "registration",
      end_time: "2023-11-06T12:00:00 Asia/Shanghai",
      summary: "2023......",
      venue: "https://....../vm/YVgulbu.aspx",
    },
    {
      event_type: "registration",
      end_time: "2023-11-06T12:00:00 Asia/Shanghai",
      summary: "2023......",
      venue: "https://....../vm/YVgulbu.aspx",
    },
  ];
  await addEventsInDB(events, "1234", "example.com");
  let r = query(
    ["event_id", "email_id", "email_address", "event_content"],
    {},
    "events"
  );
  console.log(r);
}

testAPI();
