import { PublicClientApplication } from "@azure/msal-node";
import express from "express";
import { shell } from "electron";
import { updateValue } from "../data/utils";
import path from "path";

const PORT = 30009;

const clientId = "c611e877-3ff1-46df-b82b-3dfe6066bb19";
const redirectUri = `http://localhost:${PORT}`; // Redirect URI registered in Azure portal
const scopes = ["Mail.Read", "offline_access"];

const msalConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/common`,
  },
};

async function authorize(address: string): Promise<StringMap> {
  const pca = new PublicClientApplication(msalConfig);

  // Step 1: Get authorization URL
  const authCodeUrlParameters = {
    scopes: scopes,
    redirectUri,
    loginHint: address,
  };

  let authUrl = await pca.getAuthCodeUrl(authCodeUrlParameters);
  shell.openExternal(authUrl);
  // console.log("Please authorize this app by visiting this url:", authUrl);

  const app = express();

  const server = app.listen(PORT, () => {
    console.log(`Local server listening on port ${PORT}`);
  });

  let credentials: StringMap = null;

  // read code from user input
  app.get("/", (req, res) => {
    // Step 2: Once the user is redirected back to your app with an authorization code
    const code = req.query.code as string;
    console.log("Auth Code:", code);
    const tokenRequest = {
      code,
      scopes: scopes,
      redirectUri,
      loginHint: address,
    };
    // res.sendFile(path.join(process.cwd(), "src/api/mailbox/success.html"));
    res.sendFile(path.join(process.resourcesPath, "success.html"));
    server.close();

    pca.acquireTokenByCode(tokenRequest).then((response) => {
      const accessToken = response.accessToken;
      console.log("access token:", accessToken);
      const homeAccountId = response.account.homeAccountId;

      const getRefreshTokenFromCache = () => {
        const cache = pca.getTokenCache().serialize();
        const rfObject = JSON.parse(cache).RefreshToken;
        for (const key of Object.keys(rfObject)) {
          if (rfObject[key].home_account_id === homeAccountId) {
            return rfObject[key].secret;
          }
        }
        console.log("No matching refresh token found.");
        throw new Error("No matching refresh token found.");
      };
      const refreshToken = getRefreshTokenFromCache();
      console.log("refresh token:", refreshToken);
      console.log("expires in:", response.expiresOn);
      credentials = {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: response.expiresOn.toISOString(),
      };
    });
  });

  while (credentials === null) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return credentials;
}

export async function handleVerifyOutlook(
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

export async function refreshOutlookCredentials(
  address: string,
  credentials: StringKeyMap
): Promise<void> {
  const expireTime = new Date(credentials.expires_in);
  const now = new Date();
  if (expireTime > now) {
    return;
  }
  // try to refresh the credentials
  const pca = new PublicClientApplication(msalConfig);
  const resp = await pca.acquireTokenByRefreshToken({
    refreshToken: credentials.refresh_token,
    scopes: scopes,
  });
  let newCredentials = {
    ...credentials,
    access_token: resp.accessToken,
    expires_in: resp.expiresOn.toISOString(),
  };
  console.log("new credentials:", newCredentials);
  updateValue("credentials", newCredentials, { address: address }, "mailboxes");
  return;
}

type VerifyResposne = {
  errMsg: string;
  credentials: { [key: string]: any };
};

type StringKeyMap = { [key: string]: any };
type StringMap = { [key: string]: string };
