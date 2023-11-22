import LoadingButton from "@mui/lab/LoadingButton";
import { Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

const removeMailbox = async (address: string): Promise<string> => {
  console.log("removing mailbox:", address);
  let errMsg = await window.electronAPI.remove_mailbox(address).catch((err) => {
    console.log("encounter error when removing mailbox:", err);
    return `fail to remove mailbox: ${err}`;
  });
  return errMsg;
};

const DeleteAccountConfirmWindow = ({
  deleteAccount,
  setDeleteAccount,
  callGetUserInfo,
}: {
  deleteAccount: string;
  setDeleteAccount: (s: string) => void;
  callGetUserInfo: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
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
              mt: 2,
            }}
          >
            {errMsg !== "" ? (
              <Alert severity="error" sx={{ width: "inherit" }}>
                {errMsg}
              </Alert>
            ) : (
              <></>
            )}
            <Typography>
              Removing a mailbox will remove all events from that mailbox. Are
              you sure?
            </Typography>
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
                onClick={() => {
                  setLoading(true);
                  removeMailbox(deleteAccount).then((errMsg: string) => {
                    setErrMsg(errMsg);
                    setLoading(false);
                    if (errMsg === "") {
                      setDeleteAccount("");
                      callGetUserInfo();
                    }
                  });
                }}
              >
                Remove
              </LoadingButton>
              <Button
                variant="text"
                color="secondary"
                sx={{ m: 1 }}
                onClick={() => {
                  setDeleteAccount("");
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default DeleteAccountConfirmWindow;
