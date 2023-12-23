import * as fs from "fs";
import { countNewMailSinceTime, retrieveEmails } from "../main";
import { shiftTimeBySeconds } from "../utils";

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

async function testCountTime() {
  const token = fs.readFileSync(TOKEN_PATH);
  const n = await countNewMailSinceTime(
    shiftTimeBySeconds(new Date(), 3600 * 24 * 7),
    "doesnotmatter@gmail.com",
    "gmail",
    JSON.parse(token.toString())
  );
  console.log(n);
}

testCountTime();
