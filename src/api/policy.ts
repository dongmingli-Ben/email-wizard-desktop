import { query } from "./data/utils";
import { countNewMailSinceMail, countNewMailSinceTime } from "./email/main";

type MailboxInfo = {
  address: string;
  protocol: string;
  credentials: StringMap;
};

type EmailInfo = {
  emailId: string;
  timestamp: Date;
};

async function getLastNMailsPolicy(
  n: number,
  mailbox: MailboxInfo
): Promise<number> {
  let lastEmailInfo = getLastEmailInfoByAddress(mailbox.address);
  if (lastEmailInfo === null) {
    return n;
  }
  let nNewMails = await countNewMailSinceMail(
    lastEmailInfo,
    mailbox.address,
    mailbox.protocol,
    mailbox.credentials
  );
  return Math.min(n, nNewMails);
}

async function getLastNDaysPolicy(
  n: number,
  mailbox: MailboxInfo
): Promise<number> {
  let lastEmailInfo = getLastEmailInfoByAddress(mailbox.address);
  let nDaysAgo = new Date();
  nDaysAgo.setDate(nDaysAgo.getDate() - n);
  if (lastEmailInfo === null) {
    return await countNewMailSinceTime(
      nDaysAgo,
      mailbox.address,
      mailbox.protocol,
      mailbox.credentials
    );
  }
  let time =
    lastEmailInfo.timestamp > nDaysAgo ? lastEmailInfo.timestamp : nDaysAgo;
  return await countNewMailSinceTime(
    time,
    mailbox.address,
    mailbox.protocol,
    mailbox.credentials
  );
}

async function getMailsSincePolicy(
  emailInfo: EmailInfo,
  mailbox: MailboxInfo
): Promise<number> {
  return await countNewMailSinceMail(
    emailInfo,
    mailbox.address,
    mailbox.protocol,
    mailbox.credentials
  );
}

export function getLastEmailInfoByAddress(address: string): EmailInfo | null {
  let data = query(["last_email_info"], { address: address }, "mailboxes");
  // console.log("getLastEmailInfoByAddress", data);
  if (data[0].last_email_info === null) {
    return null;
  }
  let lastEmailInfo = JSON.parse(data[0].last_email_info);
  lastEmailInfo.timestamp = new Date(lastEmailInfo.timestamp);
  return lastEmailInfo;
}

export async function getNMailsByPolicy(
  policy: StringKeyMap,
  mailbox: MailboxInfo
): Promise<number> {
  if (policy.policy === "last-n-mails") {
    return await getLastNMailsPolicy(policy.n, mailbox);
  } else if (policy.policy === "last-n-days") {
    return await getLastNDaysPolicy(policy.n, mailbox);
  } else if (policy.policy === "all-since-last-parse") {
    let lastEmailInfo = getLastEmailInfoByAddress(mailbox.address);
    if (lastEmailInfo === null) {
      return getNMailsByPolicy(policy.first_parse_policy, mailbox);
    }
    return await getMailsSincePolicy(lastEmailInfo, mailbox);
  } else {
    throw `Unsupported email reading policy: ${policy.policy}`;
  }
}

type StringMap = { [key: string]: string };
type StringKeyMap = { [key: string]: any };
