import { initDatabase } from "../data/init";
import * as fs from "fs";
import { addRow } from "../data/utils";
import { handleGetMailboxes } from "../main";

export async function prepareTestDatabase(): Promise<void> {
  initDatabase(true);
  let token = JSON.parse(fs.readFileSync("token.json", "utf8"));
  addRow(
    {
      address: "example@gmail.com",
      protocol: "gmail",
      credentials: token,
    },
    "mailboxes"
  );
  let mailboxes = await handleGetMailboxes();
  console.log("test databased initialized as:", mailboxes);
}
