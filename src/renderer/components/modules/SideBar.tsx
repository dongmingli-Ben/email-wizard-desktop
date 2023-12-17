import React, { useEffect, useState } from "react";
import UserAccountInfo from "./UserAccountInfo";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

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
        // overflow: "scroll",
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
    </Box>
  );
};

export default SideBar;
export type { userInfoType };
