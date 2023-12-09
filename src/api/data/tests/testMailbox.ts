import { initDatabase } from "../init";
import { addRow, deleteRows, query, updateValue } from "../utils";

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
  let result = query(
    ["address", "protocol", "credentials"],
    { address: "example.com" },
    "mailboxes"
  );
  console.log(result);
}

function testAddAndUpdate(): void {
  initDatabase(true);
  testAdd();
  addRow(
    {
      address: "gmail.com",
      protocol: "gmail",
      credentials: { access_token: "1234" },
    },
    "mailboxes"
  );
  let result = query(["address", "protocol", "credentials"], {}, "mailboxes");
  console.log(result);
  updateValue(
    "credentials",
    { server: "imap.126.com" },
    { address: "example.com" },
    "mailboxes"
  );
  result = query(["address", "protocol", "credentials"], {}, "mailboxes");
  console.log(result);
}

function testAddUpdateDelete(): void {
  testAddAndUpdate();
  deleteRows({ address: "example.com" }, "mailboxes");
  let result = query(["address", "protocol", "credentials"], {}, "mailboxes");
  console.log(result);
}

testAddUpdateDelete();
