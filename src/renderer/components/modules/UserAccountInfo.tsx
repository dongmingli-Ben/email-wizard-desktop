import React, { useEffect, useState } from "react";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SyncProblemIcon from "@mui/icons-material/SyncProblem";

type UserAccountInfoProps = {
  userName: string;
  userAccounts: { address: string; protocol: string }[];
  errorMailboxes: string[];
  setAddAccount: (status: boolean) => void;
  setDeleteAccount: (address: string) => void;
  setUpdateAccount: (mailbox: { address: string; protocol: string }) => void;
};

const UserMailboxRow = (props: {
  address: string;
  protocol: string;
  setDeleteAccount: (address: string) => void;
  setUpdateAccount: (mailbox: { address: string; protocol: string }) => void;
  errorMailboxes: string[];
}) => {
  const [inError, setInError] = useState(
    props.errorMailboxes.includes(props.address)
  );

  useEffect(() => {
    setInError(props.errorMailboxes.includes(props.address));
  }, [props.errorMailboxes]);

  return (
    <Grid
      item
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          "&:hover": {
            backgroundColor: "primary.dark",
            opacity: [0.9, 0.8, 0.7],
            cursor: "default",
          },
          width: "100%",
          pl: "10%",
          pr: "5%",
          pt: 0.2,
          pb: 0.2,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          color="inherit"
          sx={{
            width: "100%",
          }}
          noWrap
        >
          {props.address}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {inError ? (
            <IconButton
              onClick={() => {
                props.setUpdateAccount({
                  address: props.address,
                  protocol: props.protocol,
                });
              }}
              color="inherit"
            >
              <SyncProblemIcon></SyncProblemIcon>
            </IconButton>
          ) : (
            <></>
          )}
          <IconButton
            onClick={() => {
              props.setDeleteAccount(props.address);
            }}
            color="inherit"
          >
            <DeleteOutlineIcon></DeleteOutlineIcon>
          </IconButton>
        </Box>
      </Box>
    </Grid>
  );
};

const UserAccountInfo = (props: UserAccountInfoProps) => {
  let rows = props.userAccounts.map(
    (account: { address: string; protocol: string }, index: number) => {
      return (
        <UserMailboxRow
          address={account.address}
          protocol={account.protocol}
          setDeleteAccount={props.setDeleteAccount}
          setUpdateAccount={props.setUpdateAccount}
          errorMailboxes={props.errorMailboxes}
          key={index}
        />
      );
    }
  );
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      sx={{
        color: "common.white",
        mt: 3,
        width: "100%",
      }}
    >
      <Grid
        item
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            "&:hover": {
              backgroundColor: "primary.dark",
              opacity: [0.9, 0.8, 0.7],
              cursor: "default",
            },
            width: "100%",
            pl: "10%",
            pr: "5%",
            pt: 1,
            pb: 1,
            boxSizing: "border-box",
          }}
        >
          <Typography
            color="inherit"
            variant="h4"
            noWrap
            sx={{
              width: "100%",
            }}
          >
            {props.userName}
          </Typography>
        </Box>
      </Grid>
      {props.userAccounts.length > 0 ? rows : <></>}
      <Grid item>
        <Box
          sx={{
            "&:hover": {
              backgroundColor: "primary.dark",
              opacity: [0.9, 0.8, 0.7],
              cursor: "default",
            },
            width: "100%",
            pl: "10%",
            pr: "5%",
            boxSizing: "border-box",
          }}
        >
          <IconButton
            onClick={() => {
              props.setAddAccount(true);
            }}
            sx={{
              color: "inherit",
              pl: 0,
              pb: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <AddCircleOutlineIcon color="inherit"></AddCircleOutlineIcon>
              <Typography
                color="inherit"
                sx={{
                  width: "100%",
                  fontWeight: "bold",
                  ml: 0.5,
                }}
                noWrap
                // gutterBottom
              >
                Add Mailbox
              </Typography>
            </Box>
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserAccountInfo;
