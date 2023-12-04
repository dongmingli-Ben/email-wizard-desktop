import { retrieveEmailIMAP } from "../email/imap";

export async function handleVerifyIMAP(
  address: string,
  credentials: StringMap
): Promise<VerifyResposne> {
  try {
    let emails = await retrieveEmailIMAP(address, credentials, 5);
    return { errMsg: "", credentials: credentials };
  } catch (e) {
    console.log(e);
    return { errMsg: e.message, credentials: {} };
  }
}
