import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, Avatar, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { appPut, backendConfig } from "../../utilities/requestUtility";
import { verifyEmailAccount } from "../../utilities/verifyEmail";

const updateMailboxCredentialsAPI = async (
  req: any,
  credentials: { [key: string]: string }
): Promise<string> => {
  let add_req = {
    credentials: credentials,
  };
  let errMsg = await appPut(
    backendConfig.update_mailbox,
    {
      userId: req.userId,
      userSecret: req.userSecret,
      address: req.emailaddress,
    },
    add_req
  )
    .then((resp) => {
      return "";
    })
    .catch((e) => {
      console.log("caught error when adding mailbox:", e);
      console.log(add_req);
      if (e.response.status != 504) {
        return e.response.data.errMsg;
      } else {
        return "Re-sync request timed out";
      }
    });
  console.log(errMsg);
  return errMsg;
};

const resyncEmailAccount = async (req: any): Promise<{ errMsg: string }> => {
  let resp = await verifyEmailAccount(req);
  if (resp.errMsg !== "") {
    return {
      errMsg: resp.errMsg,
    };
  }
  let errMsg = await updateMailboxCredentialsAPI(req, resp.credentials);
  if (errMsg !== "") {
    return {
      errMsg: errMsg,
    };
  }
  return {
    errMsg: "",
  };
};

const UpdateAccountWindow = ({
  userId,
  userSecret,
  updateAccount,
  setUpdateAccount,
  callGetUserEvents,
  removeMailboxFromError,
}: {
  userId: number;
  userSecret: string;
  updateAccount: { address: string; protocol: string };
  setUpdateAccount: (mailbox: { address: string; protocol: string }) => void;
  callGetUserEvents: () => void;
  removeMailboxFromError: (address: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const requirePassword = (emailType: string): boolean => {
    let needPasswordEmails = ["IMAP", "POP3"];
    return needPasswordEmails.includes(emailType);
  };

  const handleSubmit = (event: any) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let req = {
      emailtype: updateAccount.protocol,
      emailaddress: updateAccount.address,
      password: data.get("password") as string,
      userId: userId,
      userSecret: userSecret,
      imapServer: data.get("server") as string,
      pop3Server: data.get("server") as string,
    };
    console.log(req);
    resyncEmailAccount(req)
      .then((resp: { errMsg: string }) => {
        setLoading(false);
        if (resp.errMsg === "") {
          console.log("updating mailbox to user:", resp);
          removeMailboxFromError(updateAccount.address);
          setUpdateAccount({ address: "", protocol: "" });
          callGetUserEvents();
        } else {
          setErrMsg(resp.errMsg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1,
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Container
          maxWidth="xs"
          fixed
          sx={{
            bgcolor: "common.white",
            pt: 1.5,
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <EmailIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sync Mailbox
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              // noValidate
              sx={{ mt: 2, width: "80%" }}
            >
              {errMsg === "" ? (
                <></>
              ) : (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                  }}
                >
                  {errMsg}
                </Alert>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="type"
                label="Email Type"
                name="protocol"
                value={updateAccount.protocol}
                disabled
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="address"
                label="Email Address"
                name="address"
                value={updateAccount.address}
                disabled
                autoFocus
              />
              {requirePassword(updateAccount.protocol) ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              ) : (
                <></>
              )}
              {updateAccount.protocol === "IMAP" ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="server"
                  label="IMAP Server"
                  type="text"
                  id="server"
                  autoComplete="xxx.imap.com"
                />
              ) : (
                <></>
              )}
              {updateAccount.protocol === "POP3" ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="server"
                  label="POP3 Server"
                  type="text"
                  id="server"
                  autoComplete="xxx.pop3.com"
                />
              ) : (
                <></>
              )}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  m: 1,
                }}
              >
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{ m: 1 }}
                  loading={loading}
                >
                  Submit
                </LoadingButton>
                <Button
                  variant="text"
                  color="secondary"
                  sx={{ m: 1 }}
                  onClick={() => {
                    setUpdateAccount({ address: "", protocol: "" });
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default UpdateAccountWindow;
