import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { HashRouter } from "react-router-dom";

// MSAL imports
import {
  PublicClientApplication,
  EventType,
  EventMessage,
  AuthenticationResult,
} from "@azure/msal-browser";
import { msalConfig } from "./utilities/authConfig";

export const msalInstance = new PublicClientApplication(msalConfig);

// Account selection logic is app dependent. Adjust as needed for different use cases.
// const accounts = msalInstance.getAllAccounts();
// if (accounts.length > 0) {
//   msalInstance.setActiveAccount(accounts[0]);
// }

msalInstance.addEventCallback((event: EventMessage) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
  }
});

// renders React Component "Root" into the DOM element with ID "root"
ReactDOM.render(
  <HashRouter>
    <App pca={msalInstance} />
  </HashRouter>,
  document.getElementById("root")
);

// allows for live updating
declare const module: {
  hot: {
    accept: () => void;
  };
};

module.hot.accept();
