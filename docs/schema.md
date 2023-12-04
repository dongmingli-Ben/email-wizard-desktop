# SQLite3 Database Schema

## Mailboxes

| attribute    | type      | constraints       |
| ------------ | --------- | ----------------- |
| address (PK) | string    | not null & unique |
| protocol     | string    | not null          |
| credentials  | JSON text |                   |

## Emails

| attribute              | type                     | constraints |
| ---------------------- | ------------------------ | ----------- |
| email ID (PK)          | string                   | not null    |
| email address (PK, FK) | string                   | not null    |
| event IDs              | array of int (JSON text) | -           |

## Events

| attribute          | type      | constraints   |
| ------------------ | --------- | ------------- |
| event ID (PK)      | integer   | not null      |
| email ID (FK)      | string    | not null      |
| email address (FK) | string    | not null      |
| event content      | JSON text | event details |
