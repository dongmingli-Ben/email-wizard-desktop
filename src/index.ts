import { app, BrowserWindow, ipcMain } from "electron";
import {
  handleAddMailbox,
  handleGetEvents,
  handleGetMailboxes,
  handleOpenURLInBrowser,
  handleRemoveMailbox,
  handleUpdateEvents,
  handleUpdateMailbox,
  handleUpdateSettings,
  handleGetSettings,
} from "./api/main";
import { initDatabase } from "./api/data/init";
import { handleVerifyGmail } from "./api/mailbox/gmail";
import { handleVerifyOutlook } from "./api/mailbox/outlook";
import { handleVerifyIMAP } from "./api/mailbox/imap";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    minWidth: 600,
    minHeight: 500,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    autoHideMenuBar: true,
    show: false,
  });
  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  initDatabase();
  ipcMain.handle("events:get", handleGetEvents);
  ipcMain.handle("events:post", (event, ...args) => {
    return handleUpdateEvents(args[0], args[1]);
  });
  ipcMain.handle("mailbox:get", handleGetMailboxes);
  ipcMain.handle("mailbox:post", (event, ...args) => {
    return handleAddMailbox(args[0], args[1], args[2]);
  });
  ipcMain.handle("mailbox:delete", (event, ...args) => {
    return handleRemoveMailbox(args[0]);
  });
  ipcMain.handle("mailbox:put", (event, ...args) => {
    return handleUpdateMailbox(args[0], args[1]);
  });
  ipcMain.handle("verify:gmail", (event, ...args) => {
    return handleVerifyGmail(args[0]);
  });
  ipcMain.handle("verify:outlook", (event, ...args) => {
    return handleVerifyOutlook(args[0]);
  });
  ipcMain.handle("verify:imap", (event, ...args) => {
    return handleVerifyIMAP(args[0], args[1]);
  });
  ipcMain.handle("browser:open", (event, ...args) => {
    return handleOpenURLInBrowser(args[0]);
  });
  ipcMain.handle("settings:put", (event, ...args) => {
    return handleUpdateSettings(args[0]);
  });
  ipcMain.handle("settings:get", handleGetSettings);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
