import { retrieveEmailGmail } from "../gmail";
import * as fs from "fs";

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
