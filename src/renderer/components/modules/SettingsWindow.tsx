import React, { useState } from "react";
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
import LoadingButton from "@mui/lab/LoadingButton";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";

const updateSettings = async (req: StringMap): Promise<string> => {
  try {
    let errMsg = await window.electronAPI.update_settings(req);
    return errMsg;
  } catch (e) {
    console.log("caught error when updating settings:", e);
    return "fail to update settings.";
  }
};

const SettingsWindow = (props: {
  setOpenSettings: (b: boolean) => void;
  callGetUserEvents: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [policy, setPolicy] = useState("");
  const [firstParsePolicy, setFirstParsePolicy] = useState("");

  const handleSubmit = (event: any) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let newPolicy: Object = null;
    if (policy === "last-n-mails" || policy === "last-n-days") {
      newPolicy = {
        policy: policy,
        n: Number(data.get("n") as string),
      };
    } else {
      newPolicy = {
        policy: policy,
        first_parse_policy: {
          policy: firstParsePolicy,
          n: Number(data.get("n") as string),
        },
      };
    }
    let req = {
      apiKey: data.get("apiKey") as string,
      emailReadPolicy: JSON.stringify(newPolicy),
    };
    console.log(req);
    updateSettings(req)
      .then((errMsg) => {
        setLoading(false);
        if (errMsg === "") {
          props.callGetUserEvents();
          props.setOpenSettings(false);
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
              <SettingsSharpIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Settings
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
              <TextField
                margin="normal"
                required
                fullWidth
                id="apiKey"
                label="OpenAI API Key"
                name="apiKey"
                autoComplete="john@example.com"
                autoFocus
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Email Reading Policy</InputLabel>
                <Select
                  value={policy}
                  onChange={(e) => {
                    setPolicy(e.target.value);
                  }}
                  label="Email Reading Policy"
                  required
                >
                  <MenuItem value={"last-n-mails"}>Last n emails</MenuItem>
                  <MenuItem value={"last-n-days"}>Last n days' emails</MenuItem>
                  <MenuItem value={"all-since-last-parse"}>All emails</MenuItem>
                </Select>
              </FormControl>
              {policy === "last-n-mails" || policy === "last-n-days" ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="n"
                  label="N"
                  name="n"
                  autoComplete="7"
                  autoFocus
                />
              ) : (
                <></>
              )}
              {policy === "all-since-last-parse" ? (
                <>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>First Reading Policy</InputLabel>
                    <Select
                      value={firstParsePolicy}
                      onChange={(e) => {
                        setFirstParsePolicy(e.target.value);
                      }}
                      label="First Reading Policy"
                      required
                    >
                      <MenuItem value={"last-n-mails"}>Last n emails</MenuItem>
                      <MenuItem value={"last-n-days"}>
                        Last n days' emails
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="n"
                    label="N"
                    name="n"
                    autoComplete="7"
                    autoFocus
                  />
                </>
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
                    props.setOpenSettings(false);
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

export default SettingsWindow;
