import { initDatabase } from "../init";
import { addRow, deleteRows, query } from "../utils";

function testAdd(): void {
  initDatabase(true);
  addRow(
    {
      address: "example.com",
      protocol: "IMAP",
      credentials: {},
    },
    "mailboxes"
  );
  addRow(
    {
      email_id: "1234",
      email_address: "example.com",
      event_ids: [],
    },
    "emails"
  );
  let r = addRow(
    {
      email_id: "1234",
      email_address: "example.com",
      event_content: {
        event_type: "registration",
        end_time: "2023-11-06T12:00:00 Asia/Shanghai",
        summary: "2023大学......",
        venue: "https://....../vm/YVgulbu.aspx",
      },
    },
    "events"
  );
  deleteRows({ event_id: r.lastInsertRowid }, "events");
  addRow(
    {
      email_id: "1234",
      email_address: "example.com",
      event_content: {
        event_type: "registration",
        end_time: "2023-11-06T12:00:00 Asia/Shanghai",
        summary: "2023......",
        venue: "https://....../vm/YVgulbu.aspx",
      },
    },
    "events"
  );
  let result = query(
    ["event_id", "email_id", "email_address", "event_content"],
    {},
    "events"
  );
  console.log(result);
}

testAdd();
