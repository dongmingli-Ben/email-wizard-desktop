# SQLite3 Database Schema

## Settings

| attribute | type   | constraints       |
| --------- | ------ | ----------------- |
| key (PK)  | string | not null & unique |
| value     | string |                   |

`Settings` is a key-value table with pre-defined keys. API calls should not attempt to add any new keys or delete any existing keys.

Pre-defined keys and default values:

```yaml
apiKey: ""
emailReadPolicy: # a string value (JSON string) from the following list
  - policy: last-n-days
    n: 7 # some numbers
  - policy: last-n-mails
    n: 25 # some numbers
  - policy: all-since-last-parse
    first-parse-policy:
      policy: last-n-days # or last-n-mails
      n: 7
```

### Policy

To support the `last-n-day` and `last-n-mails` policy, the email reading module needs to provide the following API:

- read the last n mails
- get the number of new emails received since the last email (must be larger than or equal to the exact number)
- read the emails since a specific time/date
- get the received date of the last email

## Mailboxes

| attribute       | type      | constraints       |
| --------------- | --------- | ----------------- |
| address (PK)    | string    | not null & unique |
| protocol        | string    | not null          |
| credentials     | JSON text |                   |
| last email info | JSON text |                   |

`last_email_info`: contains information about the last read emails, such as email id and received datetime. This field is intended for [email reading policies](#policy) in the above section. The field contains the following field:

```yaml
email_id: string
timestamp: string
```

When the `last_email_info` field is not supplied in the time adding a new mailbox, the field will be null.

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
