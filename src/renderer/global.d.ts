type StringMap = { [key: string]: string };
type StringKeyMap = { [key: string]: any };

export interface IElectronAPI {
  get_events: () => Promise<StringMap[] | StringKeyMap>;
  update_events: (address: string, kwargs: StringMap) => Promise<string>;
  verify_email: (req: StringMap) => Promise<StringKeyMap>;
  get_mailboxes: () => Promise<StringMap[] | StringKeyMap>;
  add_mailbox: (
    type: string,
    address: string,
    credentials: StringMap
  ) => Promise<string>;
  remove_mailbox: (address: string) => Promise<string>;
  update_mailbox: (address: string, credentials: StringMap) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }

  type StringKeyMap = { [key: string]: any };
  type StringMap = { [key: string]: string };
}
