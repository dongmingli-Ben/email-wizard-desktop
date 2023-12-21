import React, { useState, useEffect } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";

const updateSettings = async (req: { apiKey: string }): Promise<string> => {
  try {
    let errMsg = await window.electronAPI.update_settings(req);
    return errMsg;
  } catch (e) {
    console.log("caught error when updating settings:", e);
    return "fail to update settings.";
  }
};

const getSettings = async (): Promise<{
  settings: StringMap;
  errMsg: string;
}> => {
  return window.electronAPI
    .get_settings()
    .then((resp) => {
      console.log("settings: ", resp);
      if ( 'errMsg' in resp ) {
        return {
          settings: {},
          errMsg: resp.errMsg,
        };
      }
      return {
        settings: resp,
        errMsg: "",
      };
    })
    .catch((e) => {
      console.log("fail to get settings:", e);
      return {
        settings: {},
        errMsg: "fail to get settings",
      };
    });
};

const SettingsWindow = (props: {
  setOpenSettings: (b: boolean) => void;
  callGetUserEvents: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openaiApiKey, setApiKey] = useState("");
  const [isSetting, setIsSetting] = useState(false);
  
  useEffect(() => {
  getSettings()
    .then(({ settings, errMsg }) => {
      console.log(settings);
      setApiKey(settings.apiKey);
    })
    .catch((e) => {
      console.log("fail to get settings:", e);
    });
  }, []);

  const handleSubmit = (event: any) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let req = {
      apiKey: data.get("apiKey") as string,
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
            {openaiApiKey === "" || openaiApiKey === "null" || isSetting ? (
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
                      if (openaiApiKey === "" || openaiApiKey === "null") {
                        props.setOpenSettings(false);
                      }
                      else {
                        setIsSetting(false);
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              // show openai api key
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "80%",
                }}
              >
                <Typography
                  sx={{
                    mt: 2,
                    mb: 2,
                    overflowWrap: "break-word",
                  }}
                >
                  OpenAI API Key: <br />
                  {openaiApiKey}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    m: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ m: 1 }}
                    onClick={() => {
                      setIsSetting(true);
                    }}
                  >
                    Change
                  </Button>
                  <Button
                    variant="text"
                    color="secondary"
                    sx={{ m: 1 }}
                    onClick={() => {
                      props.setOpenSettings(false);
                    }}
                  >
                    Quit
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default SettingsWindow;
export { updateSettings , getSettings};
