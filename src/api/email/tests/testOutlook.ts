import { retrieveEmailOutlook } from "../outlook";
import * as fs from "fs";

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

// testOutlook();
