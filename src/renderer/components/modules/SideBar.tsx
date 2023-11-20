import React, { useEffect, useState } from "react";
import UserAccountInfo from "./UserAccountInfo";
import { useNavigate } from "react-router-dom";
import { appGet } from "../../utilities/requestUtility";
import { backendConfig } from "../../utilities/requestUtility";
import { clearCurrentUserCredentials } from "../../utilities/credentialUtility";
import { Box, Button } from "@mui/material";

type userInfoType = {
  username: string;
  useraccounts: { address: string; protocol: string }[];
};

type SideBarProps = {
  userId: number;
  userSecret: string;
  userInfo: userInfoType | undefined;
  toGetUserInfo: boolean;
  errorMailboxes: string[];
  setUserInfo: (info: userInfoType) => void;
  setAddAccount: (status: boolean) => void;
  setDeleteAccount: (mailbox: string) => void;
  setUpdateAccount: (mailbox: { address: string; protocol: string }) => void;
  setUserId: (userId: number) => void;
  setUserSecret: (userSecret: string) => void;
};

const getUserInfoAPI = async (
  userId: number,
  userSecret: string
): Promise<{
  userName: string;
  userAccounts: { address: string; protocol: string }[];
  errMsg: string;
}> => {
  return appGet(
    backendConfig.user_profile,
    { userId: userId, userSecret: userSecret },
    {}
  )
    .then((resp) => {
      console.log("mailboxes: ", resp.mailboxes);
      let mailboxes = resp.mailboxes.length > 0 ? resp.mailboxes : [];
      return {
        userName: resp.user_name,
        userAccounts: mailboxes.map((ele: any) => {
          return { address: ele.username, protocol: ele.protocol };
        }),
        errMsg: "",
      };
    })
    .catch((e) => {
      console.log("fail to get user profile:", e);
      return {
        userName: "",
        userAccounts: [],
        errMsg: "fail to get user profile",
      };
    });
};

const SideBar = (props: SideBarProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.userId <= 0 || props.userSecret.length === 0) {
      console.log("null user id and secret. Waiting for next render ...");
      return;
    }
    getUserInfoAPI(props.userId, props.userSecret)
      .then(({ userName, userAccounts, errMsg }) => {
        console.log(userName);
        console.log(userAccounts);
        props.setUserInfo({
          username: userName,
          useraccounts: userAccounts,
        });
      })
      .catch((e) => {
        console.log("fail to fetch user profile:", e);
      });
  }, [props.userId, props.userSecret, props.toGetUserInfo]);

  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        width: "20vw",
      }}
    >
      <UserAccountInfo
        userName={props.userInfo ? props.userInfo.username : ""}
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
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={(e) => {
          // log out the current user
          // clear current user credential from user local/session storage
          clearCurrentUserCredentials(props.userId);
          props.setUserId(-1);
          props.setUserSecret("");
          navigate("/");
        }}
        sx={{
          position: "absolute",
          bottom: "0%",
          width: "inherit",
        }}
      >
        Log Out
      </Button>
    </Box>
  );
};

export default SideBar;
export type { userInfoType };
