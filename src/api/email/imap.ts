import Imap from "imap";
const simpleParser = require("mailparser").simpleParser;
type StringKeyMap = { [key: string]: any };
type StringMap = { [key: string]: string };

function createConnection(address: string, credentials: StringMap): Imap {
  return new Imap({
    user: address,
    password: credentials["password"],
    host: credentials["imap_server"],
    port: parseInt(credentials["imap_port"]) || 993, // IMAPS port
    tls: true,
    // authTimeout: 20000,
  });
}

export async function retrieveEmailIMAP(
  address: string,
  credentials: StringMap,
  nMails: number
): Promise<[string, StringKeyMap][]> {
  const imap = createConnection(address, credentials);

  function openInbox(cb: (error: Error | null, mailbox?: any) => void) {
    imap.openBox("INBOX", true, cb);
  }

  let emails: [string, StringKeyMap][] = [];
  let done = false;
  let nums = 0;

  imap.once("ready", () => {
    console.log("imap ready");
    openInbox((error, box) => {
      if (error) throw error;

      const totalEmails = box.messages.total;
      const startSeqNo = Math.max(totalEmails - nMails + 1, 1);
      const endSeqNo = totalEmails;
      nums = endSeqNo - startSeqNo + 1;

      const fetch = imap.seq.fetch(`${startSeqNo}:${endSeqNo}`, {
        bodies: "",
      });

      fetch.on("message", (msg, seqno) => {
        let email: StringKeyMap = {};
        let contentReady = false;

        msg.on("body", (stream, info) => {
          let buffer = "";

          stream.on("data", (chunk) => {
            buffer += chunk.toString("utf8");
          });

          stream.once("end", () => {
            simpleParser(buffer, {}).then((parsed: any) => {
              //   console.log(parsed);
              email = {
                subject: parsed.subject,
                sender: parsed.from.text,
                date: parsed.date,
                recipient: parsed.to.value.map((recipient: any) => {
                  return recipient.address;
                }),
                content: [parsed.text],
              };
              emails.push([seqno.toString(), email]);
              contentReady = true;
            });
          });
        });

        msg.once("end", async () => {
          while (!contentReady) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          emails.push([seqno.toString(), email]);
        });
      });

      fetch.once("end", () => {
        imap.end(); // Close the connection
        done = true;
      });
    });
  });

  imap.connect();

  while (!done || emails.length < nums) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return emails;
}
