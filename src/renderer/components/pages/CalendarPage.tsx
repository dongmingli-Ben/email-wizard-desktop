import React, { useState, useEffect } from "react";
import Feed from "../modules/Feed";
import SideBar, { userInfoType } from "../modules/SideBar";
import AddAccountWindow from "../modules/AddAccountWindow";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import DeleteAccountConfirmWindow from "../modules/DeleteAccountWindow";
import UpdateAccountWindow from "../modules/UpdateAccountWindow";
import SettingsWindow from "../modules/SettingsWindow";
import { getUserInfoAPI } from "../modules/SideBar";

/**
 * Define the "CalendarPage" component as a function.
 */
const CalendarPage = () => {
  const [addAccount, setAddAccount] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState("");
  const [updateAccount, setUpdateAccount] = useState<{
    address: string;
    protocol: string;
  }>({
    address: "",
    protocol: "",
  });
  const [userInfo, setUserInfo] = useState<userInfoType>();
  const [errorMailboxes, setErrorMailboxes] = useState<string[]>([]);
  const [appErrMsg, setAppErrMsg] = useState("");

  const [toGetUserInfo, setToGetUserInfo] = useState(false);
  const [toGetUserEvents, setToGetUserEvents] = useState(false);

  const callGetUserInfo = () => {
    setToGetUserInfo(!toGetUserInfo);
  };

  const callGetUserEvents = () => {
    setToGetUserEvents(!toGetUserEvents);
  };

  const removeMailboxFromError = (address: string) => {
    let mailboxes = errorMailboxes.filter((addr) => addr != address);
    setErrorMailboxes(mailboxes);
  };

  // output type of userInfo
  // judge whether userInfo is undefined
  const isNoAccount = (userInfo: userInfoType | undefined): boolean => {
    if (userInfo === undefined) {
      console.log("userInfo is undefined");
      return true;
    }
    if (userInfo.useraccounts.length === 0) {
      console.log("userInfo.useraccounts is empty");
      console.log(userInfo);
      return true;
    }
    return false;
  };

  useEffect(() => {
    getUserInfoAPI()
      .then(({ userAccounts, errMsg }) => {
        console.log(userAccounts);
        setUserInfo({
          useraccounts: userAccounts,
        });
      })
      .catch((e) => {
        console.log("fail to fetch user profile:", e);
      });
  }, [toGetUserInfo]);

  if (userInfo === undefined) {
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "primary.main",
          zIndex: 1,
        }}
      ></Box>
    );
  }

  if (isNoAccount(userInfo)) {
    return (
      <AddAccountWindow
        userInfo={userInfo}
        firstTime={true}
        setUserInfo={setUserInfo}
        setAddAccount={setAddAccount}
        callGetUserInfo={callGetUserInfo}
      />
    );
  }

  return (
    // <> is like a <div>, but won't show
    // up in the DOM tree
    <Container
      disableGutters
      component="main"
      sx={{
        minWidth: "100%",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          zIndex: addAccount || deleteAccount !== "" ? 10 : 0,
          height: "100%",
          width: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <SideBar
          userInfo={userInfo}
          setAddAccount={setAddAccount}
          setDeleteAccount={setDeleteAccount}
          setUpdateAccount={setUpdateAccount}
          setOpenSettings={setOpenSettings}
          errorMailboxes={errorMailboxes}
          setAppErrMsg={setAppErrMsg}
        />
        <Feed
          userInfo={userInfo}
          setErrorMailboxes={setErrorMailboxes}
          toGetUserEvents={toGetUserEvents}
          appErrMsg={appErrMsg}
          setAppErrMsg={setAppErrMsg}
        />
      </Box>
      {addAccount ? (
        <AddAccountWindow
          userInfo={userInfo}
          firstTime={false}
          setUserInfo={setUserInfo}
          setAddAccount={setAddAccount}
          callGetUserInfo={callGetUserInfo}
        />
      ) : (
        <></>
      )}
      {deleteAccount !== "" ? (
        <DeleteAccountConfirmWindow
          deleteAccount={deleteAccount}
          setDeleteAccount={setDeleteAccount}
          callGetUserInfo={callGetUserInfo}
        />
      ) : (
        <></>
      )}
      {updateAccount.address !== "" ? (
        <UpdateAccountWindow
          updateAccount={updateAccount}
          setUpdateAccount={setUpdateAccount}
          callGetUserEvents={callGetUserEvents}
          removeMailboxFromError={removeMailboxFromError}
        />
      ) : (
        <></>
      )}
      {openSettings ? (
        <SettingsWindow
          setOpenSettings={setOpenSettings}
          callGetUserEvents={callGetUserEvents}
        />
      ) : (
        <></>
      )}
    </Container>
  );
};

export default CalendarPage;
