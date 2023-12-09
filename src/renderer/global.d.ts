type StringMap = { [key: string]: string };
type StringKeyMap = { [key: string]: any };

type VerifyResposne = {
  errMsg: string;
  credentials: { [key: string]: string };
};

export interface IElectronAPI {
  get_events: () => Promise<StringMap[] | StringKeyMap>;
  update_events: (address: string, kwargs: StringMap) => Promise<string>;
  get_mailboxes: () => Promise<StringMap[] | StringKeyMap>;
  add_mailbox: (
    type: string,
    address: string,
    credentials: StringMap
  ) => Promise<string>;
  remove_mailbox: (address: string) => Promise<string>;
  update_mailbox: (address: string, credentials: StringMap) => Promise<string>;
  verify_gmail: (address: string) => Promise<VerifyResposne>;
  verify_outlook: (address: string) => Promise<VerifyResposne>;
  verify_imap: (
    address: string,
    credentials: StringMap
  ) => Promise<VerifyResposne>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }

  type StringKeyMap = { [key: string]: any };
  type StringMap = { [key: string]: string };
  type VerifyResposne = {
    errMsg: string;
    credentials: StringKeyMap;
  };
}
