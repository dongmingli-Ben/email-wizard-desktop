// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

type StringMap = { [key: string]: string };

contextBridge.exposeInMainWorld("electronAPI", {
  get_events: () => ipcRenderer.invoke("events:get"),
  update_events: (address: string, kwargs: StringMap) =>
    ipcRenderer.invoke("events:post", address, kwargs),
  get_mailboxes: () => ipcRenderer.invoke("mailbox:get"),
  add_mailbox: (type: string, address: string, credentials: StringMap) =>
    ipcRenderer.invoke("mailbox:post", type, address, credentials),
  remove_mailbox: (address: string) =>
    ipcRenderer.invoke("mailbox:delete", address),
  update_mailbox: (address: string, credentials: StringMap) =>
    ipcRenderer.invoke("mailbox:put", address, credentials),
  verify_gmail: (address: string) =>
    ipcRenderer.invoke("verify:gmail", address),
  verify_outlook: (address: string) =>
    ipcRenderer.invoke("verify:outlook", address),
  verify_imap: (address: string, credentials: StringMap) =>
    ipcRenderer.invoke("verify:imap", address, credentials),
  browser_open: (url: string) => ipcRenderer.invoke("browser:open", url),
  update_settings: (req: StringMap) => ipcRenderer.invoke("settings:put", req),
  get_settings: () => ipcRenderer.invoke("settings:get"),
});
