import * as fs from "fs";
import { retrieveEmailIMAP } from "../imap";

const PATH = "configs/test_imap.json";

export async function testIMAP() {
  const token = fs.readFileSync(PATH);
  const item = JSON.parse(token.toString());
  const emails = await retrieveEmailIMAP(item.username, item.credentials, 10);
  for (const [id, email] of emails) {
    console.log("email id: ", id);
    console.log(email);
  }
}

// testIMAP();