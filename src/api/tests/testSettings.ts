import { initDatabase } from "../data/init";
import { query, updateValue } from "../data/utils";
import { handleUpdateSettings } from "../main";

async function testReadInitSettings(): Promise<void> {
  initDatabase(true);
  let data = query(["*"], {}, "settings");
  console.log(data);
}

async function testUpdateSettings(): Promise<void> {
  initDatabase(true);
  let errMsg = handleUpdateSettings({ apiKey: "1234" });
  console.log(errMsg);
  let data = query(["*"], {}, "settings");
  console.log(data);
}

async function testUpdateNewKeySettings(): Promise<void> {
  initDatabase(true);
  let errMsg = await handleUpdateSettings({ newKey: "1234" });
  console.log(errMsg);
  let data = query(["*"], {}, "settings");
  console.log(data);
}

// testReadInitSettings();
// testUpdateSettings();
testUpdateNewKeySettings();
