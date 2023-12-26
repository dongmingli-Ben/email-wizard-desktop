import { countNewMailSinceTimeGmail, retrieveEmailGmail } from "../gmail";
import * as fs from "fs";
import { shiftTimeBySeconds } from "../utils";

const TOKEN_PATH = "token.json";

export async function testGmail() {
  const token = fs.readFileSync(TOKEN_PATH);
  const emails = await retrieveEmailGmail(
    "doesnotmatter@gmail.com",
    JSON.parse(token.toString()),
    10
  );
  for (const [id, email] of emails) {
    console.log("email id: ", id);
    console.log(email);
  }
}

async function testGmailCountTime() {
  const token = fs.readFileSync(TOKEN_PATH);
  const n = await countNewMailSinceTimeGmail(
    "doesnotmatter@gmail.com",
    JSON.parse(token.toString()),
    shiftTimeBySeconds(new Date(), 3600 * 24 * 10)
  );
  console.log(n);
}

testGmailCountTime();
