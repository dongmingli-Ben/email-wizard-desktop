import { cleanRawContent } from "./clean";
import {
  countNewMailSinceMailGmail,
  countNewMailSinceTimeGmail,
  retrieveEmailGmail,
} from "./gmail";
import {
  countNewMailSinceMailIMAP,
  countNewMailSinceTimeIMAP,
  retrieveEmailIMAP,
} from "./imap";
import {
  countNewMailSinceMailOutlook,
  countNewMailSinceTimeOutlook,
  retrieveEmailOutlook,
} from "./outlook";
import { shiftTimeBySeconds } from "./utils";

type StringKeyMap = { [key: string]: any };
type StringMap = { [key: string]: string };
type EmailInfo = {
  emailId: string;
  timestamp: Date;
};

async function retrieveRawEmails(
  address: string,
  protocol: string,
  credentials: StringMap,
  nMails: number
): Promise<[string, StringKeyMap][]> {
  if (protocol === "IMAP") {
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

export async function countNewMailSinceMail(
  mail: EmailInfo,
  address: string,
  protocol: string,
  credentials: StringMap
): Promise<number> {
  if (protocol === "IMAP") {
    return await countNewMailSinceMailIMAP(address, credentials, mail);
  } else if (protocol === "outlook") {
    return await countNewMailSinceMailOutlook(address, credentials, mail);
  } else if (protocol == "gmail") {
    return await countNewMailSinceMailGmail(address, credentials, mail);
  } else {
    throw new Error("unsupported protocol");
  }
}

export async function countNewMailSinceTime(
  ts: Date,
  address: string,
  protocol: string,
  credentials: StringMap
): Promise<number> {
  if (protocol === "IMAP") {
    return await countNewMailSinceTimeIMAP(
      address,
      credentials,
      // shift to accomondate timezone difference
      shiftTimeBySeconds(ts, 3600 * 24)
    );
  } else if (protocol === "outlook") {
    return await countNewMailSinceTimeOutlook(
      address,
      credentials,
      // shift to add redundancy
      shiftTimeBySeconds(ts, 60)
    );
  } else if (protocol == "gmail") {
    return await countNewMailSinceTimeGmail(
      address,
      credentials,
      // shift to add redundancy
      shiftTimeBySeconds(ts, 60)
    );
  } else {
    throw new Error("unsupported protocol");
  }
}
