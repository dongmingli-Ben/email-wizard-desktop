import React, { useState, useEffect } from "react";
import Feed from "../modules/Feed";
import SideBar, { userInfoType } from "../modules/SideBar";
import AddAccountWindow from "../modules/AddAccountWindow";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import DeleteAccountConfirmWindow from "../modules/DeleteAccountWindow";
import UpdateAccountWindow from "../modules/UpdateAccountWindow";

type CalendarPageProps = {
  userId: number;
  userSecret: string;
  setUserId: (userId: number) => void;
  setUserSecret: (userSecret: string) => void;
};

/**
 * Define the "CalendarPage" component as a function.
 */
const CalendarPage = (props: CalendarPageProps) => {
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

  const navigate = useNavigate();
  useEffect(() => {
    const delay = 100;

    // Introduce a delay using setTimeout
    const timerId = setTimeout(() => {
      // Check user id here
      if (props.userId <= 0 || props.userSecret.length === 0) {
        // Navigate the user to the login page
        console.log(
          `current user id: ${props.userId}, secret: ${props.userSecret}`
        );
        navigate("/login");
      }
    }, delay);

    // Clear the timeout if the component unmounts or the effect is re-executed
    return () => clearTimeout(timerId);
  }, [props.userId, props.userSecret]);

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
        }}
      >
        <SideBar
          userId={props.userId}
          userSecret={props.userSecret}
          setUserId={props.setUserId}
          setUserSecret={props.setUserSecret}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setAddAccount={setAddAccount}
          setDeleteAccount={setDeleteAccount}
          setUpdateAccount={setUpdateAccount}
          toGetUserInfo={toGetUserInfo}
          errorMailboxes={errorMailboxes}
        />
        <Feed
          userId={props.userId}
          userSecret={props.userSecret}
          userInfo={userInfo}
          setErrorMailboxes={setErrorMailboxes}
          toGetUserEvents={toGetUserEvents}
        />
      </Box>
      {addAccount ? (
        <AddAccountWindow
          userId={props.userId}
          userSecret={props.userSecret}
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
          userId={props.userId}
          userSecret={props.userSecret}
          deleteAccount={deleteAccount}
          setDeleteAccount={setDeleteAccount}
          callGetUserInfo={callGetUserInfo}
        />
      ) : (
        <></>
      )}
      {updateAccount.address !== "" ? (
        <UpdateAccountWindow
          userId={props.userId}
          userSecret={props.userSecret}
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
