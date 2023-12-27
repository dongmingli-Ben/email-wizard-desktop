import * as fs from "fs";
import { countNewMailSinceTimeIMAP, retrieveEmailIMAP } from "../imap";
import { retrieveEmails } from "../main";
import { shiftTimeBySeconds } from "../utils";

const PATH = "configs/test_imap.json";

export async function testIMAP() {
  const token = fs.readFileSync(PATH);
  const item = JSON.parse(token.toString());
  // const emails = await retrieveEmailIMAP(item.username, item.credentials, 10);
  const emails = await retrieveEmails(
    item.username,
    item.protocol,
    item.credentials,
    10
  );
  for (const [id, email] of emails) {
    console.log("email id: ", id);
    console.log(email);
  }
}

async function testIMAPCountTime() {
  const token = fs.readFileSync(PATH);
  const item = JSON.parse(token.toString());
  const n = await countNewMailSinceTimeIMAP(
    item.username,
    item.credentials,
    shiftTimeBySeconds(new Date(), 60)
  );
  console.log(n);
}

// testIMAP();
testIMAPCountTime();
