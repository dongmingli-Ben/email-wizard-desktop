import React, { useState, useEffect } from "react";
import Feed from "../modules/Feed";
import SideBar, { userInfoType } from "../modules/SideBar";
import AddAccountWindow from "../modules/AddAccountWindow";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import DeleteAccountConfirmWindow from "../modules/DeleteAccountWindow";
import UpdateAccountWindow from "../modules/UpdateAccountWindow";

/**
 * Define the "CalendarPage" component as a function.
 */
const CalendarPage = () => {
  const [addAccount, setAddAccount] = useState(false);
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
          setUserInfo={setUserInfo}
          setAddAccount={setAddAccount}
          setDeleteAccount={setDeleteAccount}
          setUpdateAccount={setUpdateAccount}
          toGetUserInfo={toGetUserInfo}
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
    </Container>
  );
};

export default CalendarPage;
