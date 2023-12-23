import { countNewMailSinceTimeOutlook, retrieveEmailOutlook } from "../outlook";
import * as fs from "fs";
import { shiftTimeBySeconds } from "../utils";

const TOKEN_PATH = "configs/test_outlook.txt";

export async function testOutlook() {
  const token = fs.readFileSync(TOKEN_PATH);
  const emails = await retrieveEmailOutlook(
    "doesnotmatter@outlook.com",
    { access_token: token.toString() },
    10
  );
  for (const [id, email] of emails) {
    console.log("email id: ", id);
    console.log(email);
  }
}

async function testOutlookCountTime() {
  const token = fs.readFileSync(TOKEN_PATH);
  const n = await countNewMailSinceTimeOutlook(
    "doesnotmatter@outlook.com",
    { access_token: token.toString() },
    shiftTimeBySeconds(new Date("Dec 10, 2023"), 60)
  );
  console.log(n);
}

// testOutlook();
testOutlookCountTime();
