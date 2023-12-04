import { google } from "googleapis";
import { OAuth2Client, Credentials } from "google-auth-library";
import * as fs from "fs";
import express from "express";
import { shell } from "electron";
import { updateValue } from "../data/utils";

const PORT = 30009;

// The scope for accessing Gmail API
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

async function authorize(address: string): Promise<Credentials> {
  const credentials = await getCredentials();
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  return getNewToken(oAuth2Client, address);
}

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

async function getNewToken(
  oAuth2Client: OAuth2Client,
  address: string
): Promise<Credentials> {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    redirect_uri: `http://localhost:${PORT}/oauth/callback`,
    login_hint: address,
  });

  shell.openExternal(authUrl);
  // console.log("Please authorize this app by visiting this url:", authUrl);

  const app = express();

  let tokens: Credentials = null;

  const server = app.listen(PORT, () => {
    console.log(`Local server listening on port ${PORT}`);
  });

  app.get("/oauth/callback", async (req, res) => {
    const code = req.query.code as string;
    tokens = (await oAuth2Client.getToken(code)).tokens;
    oAuth2Client.setCredentials(tokens);
    res.send("Authentication successful! You can close this window now.");

    // Close the server after handling the callback
    server.close();

    // Continue with authentication process or close the window, etc.
    console.log("Authentication successful!");
  });

  // Wait until the callback is called
  while (tokens === null) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return tokens;
}

export async function handleVerifyGmail(
  address: string
): Promise<VerifyResposne> {
  try {
    let credentials = await authorize(address);
    return { errMsg: "", credentials: credentials };
  } catch (e) {
    console.log(e);
    return { errMsg: e.message, credentials: {} };
  }
}

export async function refreshGmailCredentials(
  address: string,
  credentials: StringKeyMap
): Promise<void> {
  const expireTime = new Date(credentials.expiry_date);
  const now = new Date();
  if (expireTime > now) {
    return;
  }
  // try to refresh the credentials
  const appCreds = await getCredentials();
  const { client_secret, client_id, redirect_uris } = appCreds.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Set the refresh token
  oAuth2Client.setCredentials({
    refresh_token: credentials.refresh_token,
  });
  const resp = await oAuth2Client.refreshAccessToken();
  console.log("new credentials:", resp.credentials);

  // The 'token' variable now contains the new access token
  updateValue(
    "credentials",
    resp.credentials,
    { address: address },
    "mailboxes"
  );
}

type VerifyResposne = {
  errMsg: string;
  credentials: { [key: string]: any };
};

type StringKeyMap = { [key: string]: any };
type StringMap = { [key: string]: string };
