import Database from "better-sqlite3";
import * as fs from "fs";

/**
 * Initialize the database.
 * @param redo whether to re-initialize the database if it already exists. Defaults to false.
 */
export function initDatabase(redo: boolean = false): void {
  if (redo && fs.existsSync("app.db")) {
    fs.unlinkSync("app.db");
  }
  // Connect to the SQLite database
  const db = new Database("app.db");

  // create settings table
  const createSettingsTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL UNIQUE,
      value TEXT NOT NULL
    )
  `);
  createSettingsTable.run();

  // Create default settings
  const insertDefaultSettings = db.prepare(`
    INSERT INTO settings (key, value)
    VALUES (?, ?)
  `);
  insertDefaultSettings.run("apiKey", "");

  // Create Mailboxes table
  const createMailboxesTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS mailboxes (
      address TEXT PRIMARY KEY NOT NULL UNIQUE,
      protocol TEXT NOT NULL,
      credentials TEXT
    )
  `);
  createMailboxesTable.run();

  // Create Emails table
  const createEmailsTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS emails (
      email_id TEXT NOT NULL,
      email_address TEXT NOT NULL,
      event_ids TEXT NOT NULL,
      PRIMARY KEY (email_id, email_address),
      FOREIGN KEY (email_address) REFERENCES mailboxes(address)
    )
  `);
  createEmailsTable.run();

  // Create Events table
  const createEventsTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS Events (
      event_id INTEGER PRIMARY KEY NOT NULL,
      email_id TEXT NOT NULL,
      email_address TEXT NOT NULL,
      event_content TEXT NOT NULL,
      FOREIGN KEY (email_id, email_address) REFERENCES emails(email_id, email_address)
    )
  `);
  createEventsTable.run();

  // Close the database connection
  db.close();
}
