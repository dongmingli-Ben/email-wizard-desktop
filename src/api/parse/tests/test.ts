import * as fs from "fs";
import { parseEmail } from "../main";

const PATH = "configs/test_email.json";

async function test() {
  let apiKey = process.env.OPENAI_API_KEY || "";
  let email = JSON.parse(fs.readFileSync(PATH).toString());
  let events = await parseEmail(email, apiKey, 5, {});
  console.log(events);
}

test();
