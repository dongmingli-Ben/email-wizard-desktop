import { handleVerifyGmail, refreshGmailCredentials } from "../mailbox/gmail";
import {
  handleVerifyOutlook,
  refreshOutlookCredentials,
} from "../mailbox/outlook";

async function testGmailRefresh() {
  let address = "dongmingli.ucsd@gmail.com";
  let { credentials, errMsg } = await handleVerifyGmail(address);
  console.log(credentials);
  refreshGmailCredentials(address, credentials);
}

async function testOutlookRefresh() {
  let address = "guangtouqiang1964@outlook.com";
  let { credentials, errMsg } = await handleVerifyOutlook(address);
  console.log(credentials);
  refreshOutlookCredentials(address, credentials);
}

// testGmailRefresh();
testOutlookRefresh();
