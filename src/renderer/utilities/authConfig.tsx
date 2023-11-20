import { Configuration, PopupRequest } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
  auth: {
    clientId: "34fe7958-6ad4-438e-8218-cb028e47fe40",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "https://www.toymaker-ben.online/calendar",
    // redirectUri: "http://localhost:39017/calendar",
    postLogoutRedirectUri: "https://www.toymaker-ben.online/calendar",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    allowNativeBroker: false, // Disables WAM Broker
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
  scopes: ["User.Read"],
  // prompt: "select_account",
  // loginHint: "guangtouqiang1964@outlook.com",
};

export const tokenRequest = {
  scopes: ["User.Read", "Mail.Read"],
  forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages",
};

export const gmailConfig = {
  client_id:
    "242378580939-kkgf0o88qh5so9jlvls0i1gm2c48fdcl.apps.googleusercontent.com",
  redirect_uri: "https://www.toymaker-ben.online/calendar",
  response_type: "code",
  scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  access_type: "offline",
  include_granted_scopes: true,
};
