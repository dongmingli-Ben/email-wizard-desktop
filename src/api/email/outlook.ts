import axios from "axios";

type StringKeyMap = { [key: string]: any };
type StringMap = { [key: string]: string };

const graphAPIUrl = "https://graph.microsoft.com/v1.0/me/messages";

export async function retrieveEmailOutlook(
  address: string,
  credentials: StringMap,
  nMails: number
): Promise<[string, StringKeyMap][]> {
  const accessToken = credentials["access_token"];
  const response = await axios
    .get(graphAPIUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params: {
        $top: nMails,
        $orderby: "receivedDateTime desc",
      },
    })
    .catch((err) => {
      console.log(
        "fail to fetch emails from outlook, error:",
        err.response.data.error
      ); // todo: test this
      throw err;
    });
  let emailPromises = response.data.value.map(async (msg: any) => {
    let email = {
      subject: msg.subject as string,
      sender: msg.sender.emailAddress.address as string,
      date: msg.sentDateTime as string,
      recipient: msg.toRecipients.map(
        (recipient: any) => recipient.emailAddress.address as string
      ),
      content: [msg.body.content as string],
    };
    return [msg.id as string, email];
  });
  return await Promise.all(emailPromises);
}
