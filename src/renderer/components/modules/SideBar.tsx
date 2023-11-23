import React, { useEffect, useState } from "react";
import UserAccountInfo from "./UserAccountInfo";
import { useNavigate } from "react-router-dom";
import { Box, Button, IconButton, Typography } from "@mui/material";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";

type userInfoType = {
  useraccounts: { address: string; protocol: string }[];
};

type SideBarProps = {
  userInfo: userInfoType | undefined;
  toGetUserInfo: boolean;
  errorMailboxes: string[];
  setUserInfo: (info: userInfoType) => void;
  setAddAccount: (status: boolean) => void;
  setDeleteAccount: (mailbox: string) => void;
  setUpdateAccount: (mailbox: { address: string; protocol: string }) => void;
  setOpenSettings: (status: boolean) => void;
  setAppErrMsg: (msg: string) => void;
};

const getUserInfoAPI = async (): Promise<{
  userAccounts: { address: string; protocol: string }[];
  errMsg: string;
}> => {
  return window.electronAPI
    .get_mailboxes()
    .then((resp) => {
      console.log("mailboxes: ", resp);
      if (Array.isArray(resp)) {
        return {
          userAccounts: resp.map((ele: any) => {
            return { address: ele.username, protocol: ele.protocol };
          }),
          errMsg: "",
        };
      }
      return {
        userAccounts: [],
        errMsg: resp.errMsg,
      };
    })
    .catch((e) => {
      console.log("fail to get user profile:", e);
      return {
        userAccounts: [],
        errMsg: "fail to get user profile",
      };
    });
};

const SideBar = (props: SideBarProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    getUserInfoAPI()
      .then(({ userAccounts, errMsg }) => {
        console.log(userAccounts);
        props.setUserInfo({
          useraccounts: userAccounts,
        });
        // todo: navigate to start page if no user accounts
        // if (errMsg === "" && userAccounts.length === 0) {
        //   navigate("/");
        // }
      })
      .catch((e) => {
        console.log("fail to fetch user profile:", e);
      });
  }, [props.toGetUserInfo]);

  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        width: "20vw",
        minWidth: "200px",
        overflow: "scroll",
        display: "flex",
        flexDirection: "column",
        pb: 2,
      }}
    >
      <UserAccountInfo
        userAccounts={
          props.userInfo && props.userInfo.useraccounts.length > 0
            ? props.userInfo.useraccounts
            : [{ address: "No accounts", protocol: "null" }]
        }
        setAddAccount={props.setAddAccount}
        setDeleteAccount={props.setDeleteAccount}
        setUpdateAccount={props.setUpdateAccount}
        errorMailboxes={props.errorMailboxes}
      />
      <SettingsTab setOpenSettings={props.setOpenSettings} />
    </Box>
  );
};

const SettingsTab = (props: { setOpenSettings: (status: boolean) => void }) => {
  return (
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
        color: "common.white",
      }}
    >
      <IconButton
        onClick={() => {
          props.setOpenSettings(true);
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
          <SettingsSharpIcon color="inherit"></SettingsSharpIcon>
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
            Settings
          </Typography>
        </Box>
      </IconButton>
    </Box>
  );
};

export default SideBar;
export type { userInfoType };
