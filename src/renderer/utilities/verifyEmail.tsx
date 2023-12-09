const verifyEmailAccount = async (req: any): Promise<VerifyResposne> => {
  let resp: VerifyResposne;
  if (req.emailtype === "outlook") {
    resp = await window.electronAPI.verify_outlook(req.emailaddress);
  } else if (req.emailtype === "IMAP") {
    resp = await window.electronAPI.verify_imap(req.emailaddress, {
      password: req.password,
      imap_server: req.imapServer,
    });
  } else if (req.emailtype === "gmail") {
    resp = await window.electronAPI.verify_gmail(req.emailaddress);
  } else {
    console.log(`Un-recognized account type: ${req.emailtype}`);
    let errMsg = `Un-recognized account type: ${req.emailtype}`;
    resp = {
      errMsg: errMsg,
      credentials: {},
    };
  }
  console.log(resp);
  return resp;
};

export { VerifyResposne, verifyEmailAccount };
