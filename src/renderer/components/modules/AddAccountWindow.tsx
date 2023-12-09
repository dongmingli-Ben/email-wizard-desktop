import React, { useState } from "react";
import { userInfoType } from "./SideBar";
import { verifyEmailAccount } from "../../utilities/verifyEmail";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LoadingButton from "@mui/lab/LoadingButton";

type AddAccountWindowProps = {
  userInfo: userInfoType | undefined;
  setUserInfo: (info: userInfoType) => void;
  setAddAccount: (status: boolean) => void;
  callGetUserInfo: () => void;
};

const addEmailAccountDBAPI = async (
  req: any,
  credentials: { [key: string]: string }
): Promise<string> => {
  let errMsg = await window.electronAPI
    .add_mailbox(req.emailtype, req.emailaddress, credentials)
    .catch((e) => {
      console.log("caught error when adding mailbox:", e);
      console.log(req, credentials);
      return "fail to add mailbox.";
    });
  return errMsg;
};

const newEmailAccount = async (req: any): Promise<string> => {
  let resp = await verifyEmailAccount(req);
  if (resp.errMsg !== "") {
    return resp.errMsg;
  }
  let errMsg = await addEmailAccountDBAPI(req, resp.credentials);
  if (errMsg !== "") {
    return errMsg;
  }
  return "";
};

const AddAccountWindow = (props: AddAccountWindowProps) => {
  const [emailType, setEmailType] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const requirePassword = (emailType: string): boolean => {
    let needPasswordEmails = ["IMAP", "POP3"];
    return needPasswordEmails.includes(emailType);
  };

  const handleSubmit = (event: any) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let req = {
      emailtype: emailType,
      emailaddress: data.get("address") as string,
      password: data.get("password") as string,
      imapServer: data.get("server") as string,
      pop3Server: data.get("server") as string,
    };
    console.log(req);
    newEmailAccount(req)
      .then((errMsg) => {
        setLoading(false);
        if (errMsg === "") {
          props.callGetUserInfo();
          props.setAddAccount(false);
        } else {
          console.log("error when adding mailbox:", errMsg);
          setErrorMsg(errMsg);
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
              New Mailbox
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              // noValidate
              sx={{ mt: 2, width: "80%" }}
            >
              {errorMsg === "" ? (
                <></>
              ) : (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                  }}
                >
                  {errorMsg}
                </Alert>
              )}
              <FormControl fullWidth>
                <InputLabel>Mailbox Type</InputLabel>
                <Select
                  value={emailType}
                  onChange={(e) => {
                    setEmailType(e.target.value);
                  }}
                  label="Mailbox Type"
                  required
                >
                  <MenuItem value={"outlook"}>Outlook</MenuItem>
                  <MenuItem value={"gmail"}>Gmail</MenuItem>
                  <MenuItem value={"IMAP"}>IMAP</MenuItem>
                  <MenuItem value={"POP3"}>POP3</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                required
                fullWidth
                id="address"
                label="Email Address"
                name="address"
                autoComplete="john@example.com"
                autoFocus
              />
              {requirePassword(emailType) ? (
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
              {emailType === "IMAP" ? (
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
              {emailType === "POP3" ? (
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
                    props.setAddAccount(false);
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

export default AddAccountWindow;
