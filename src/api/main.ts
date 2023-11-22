type StringMap = { [key: string]: string };
type StringKeyMap = { [key: string]: any };

const DUMMY_MAILBOXES = [
  {
    username: "dummy@example.com",
    protocol: "gmail",
  },
];

export async function handleGetEvents(): Promise<StringMap[] | StringKeyMap> {
  return [
    {
      event_type: "registration",
      end_time: "2023-11-06T12:00:00 Asia/Shanghai",
      summary: "2023大学......",
      venue: "https://....../vm/YVgulbu.aspx",
    },
  ];
}

export async function handleUpdateEvents(
  address: string,
  kwargs: StringMap
): Promise<string> {
  return "";
}

export async function handleVerifyMailbox(
  req: StringMap
): Promise<StringKeyMap> {
  return {};
}

export async function handleGetMailboxes(): Promise<
  StringMap[] | StringKeyMap
> {
  return DUMMY_MAILBOXES;
}

export async function handleAddMailbox(
  type: string,
  address: string,
  credentials: StringMap
): Promise<StringKeyMap> {
  return {};
}

export async function handleRemoveMailbox(address: string): Promise<string> {
  return "";
}

export async function handleUpdateMailbox(
  address: string,
  credentials: StringMap
): Promise<string> {
  return "";
}
