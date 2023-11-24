import * as fs from "fs";
import { retrieveEmails } from "../main";

const TOKEN_PATH = "token.json";

async function test(): Promise<void> {
  const token = fs.readFileSync(TOKEN_PATH);
  const emails = await retrieveEmails(
    "doesnotmatter@gmail.com",
    "gmail",
    JSON.parse(token.toString()),
    10
  );
  for (const [id, email] of emails) {
    console.log("email id: ", id);
    console.log(email);
  }
}

test();
