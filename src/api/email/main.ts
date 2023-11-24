import { cleanRawContent } from "./clean";
import { retrieveEmailGmail } from "./gmail";
import { retrieveEmailIMAP } from "./imap";
import { retrieveEmailOutlook } from "./outlook";

type StringKeyMap = { [key: string]: any };
type StringMap = { [key: string]: string };

async function retrieveRawEmails(
  address: string,
  protocol: string,
  credentials: StringMap,
  nMails: number
): Promise<[string, StringKeyMap][]> {
  if (protocol === "imap") {
    return await retrieveEmailIMAP(address, credentials, nMails);
  } else if (protocol === "outlook") {
    return await retrieveEmailOutlook(address, credentials, nMails);
  } else if (protocol == "gmail") {
    return await retrieveEmailGmail(address, credentials, nMails);
  } else {
    throw new Error("unsupported protocol");
  }
}

export async function retrieveEmails(
  address: string,
  protocol: string,
  credentials: StringMap,
  nMails: number
): Promise<[string, StringKeyMap][]> {
  let rawEmails = await retrieveRawEmails(
    address,
    protocol,
    credentials,
    nMails
  );
  let emails = rawEmails.map(([id, email]): [string, StringKeyMap] => {
    email["content"] = cleanRawContent(email["content"]);
    return [id, email];
  });
  return emails;
}
