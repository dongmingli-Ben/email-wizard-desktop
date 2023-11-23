import { gmail_v1, google } from "googleapis";
import { OAuth2Client, Credentials } from "google-auth-library";
import * as fs from "fs";

type StringKeyMap = { [key: string]: any };
type StringMap = { [key: string]: string };

async function getCredentials(): Promise<any> {
  // Load client secrets from a file
  try {
    const content = fs.readFileSync("./configs/google.json");
    return JSON.parse(content.toString());
  } catch (err) {
    console.error("Error loading client secret file:", err);
    throw err;
  }
}

function decodeBase64Url(data: string): string {
  let s = data.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4 != 0) {
    s += "=";
  }
  return Buffer.from(s, "base64").toString("utf-8");
}

function getRawTexts(payload: gmail_v1.Schema$MessagePart): string[] {
  let mime = payload.mimeType;
  let contents: string[] = [];
  if (
    mime.startsWith("multipart") ||
    (payload.body.size == 0 && payload.parts.length > 0)
  ) {
    for (const part of payload.parts) {
      let childrens = getRawTexts(part);
      contents = [...contents, ...childrens];
    }
  } else if (mime === "text/plain") {
    let content = decodeBase64Url(payload.body.data);
    contents.push(content);
  }
  return contents;
}

export async function retrieveEmailGmail(
  address: string,
  credentials: StringMap,
  nMails: number
): Promise<[string, StringKeyMap][]> {
  const appCreds = await getCredentials();
  const { client_secret, client_id, redirect_uris } = appCreds.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  oAuth2Client.setCredentials(credentials as Credentials);

  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: nMails,
  });
  const msgIds = response.data.messages.map((msg) => msg.id);
  const emailPromises: Promise<[string, StringKeyMap]>[] = msgIds.map(
    async (msgId): Promise<[string, StringKeyMap]> => {
      const resp = await gmail.users.messages.get({
        userId: "me",
        id: msgId,
      });
      let subject = null;
      let sender = null;
      let date = null;
      let recipient = null;
      for (const header of resp.data.payload.headers) {
        if (header.name === "Subject") {
          subject = header.value;
        } else if (header.name === "From") {
          sender = header.value;
        } else if (header.name === "Date") {
          date = header.value;
        } else if (header.name === "To") {
          recipient = [header.value];
        }
      }
      let contents = getRawTexts(resp.data.payload);

      let raw_email = {
        subject: subject,
        sender: sender,
        date: date,
        recipient: recipient,
        contents: contents.join(" "),
      };
      return [msgId, raw_email];
    }
  );
  return await Promise.all(emailPromises);
}
