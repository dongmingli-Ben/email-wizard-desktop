import React from "react";
import Calendar from "./Calendar";
import { userInfoType } from "./SideBar";
import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";

type FeedProps = {
  userInfo: userInfoType | undefined;
  toGetUserEvents: boolean;
  appErrMsg: string;
  setErrorMailboxes: (addresses: string[]) => void;
  setAppErrMsg: (msg: string) => void;
};

const Feed = (props: FeedProps) => {
  // useEffect(() => {
  //   props.setAppErrMsg("something wrong with the app");
  // }, []);
  return (
    <Box
      sx={{
        width: "80%",
        height: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      pb="3%"
      pr="3%"
      pl="3%"
      pt={props.appErrMsg !== "" ? 1 : 3}
    >
      {props.appErrMsg !== "" ? (
        <Alert
          severity="warning"
          sx={{
            mb: 1,
            flex: "0 0 auto",
          }}
          onClose={() => {
            console.log("setting appErrMsg to empty");
            props.setAppErrMsg("");
          }}
        >
          {props.appErrMsg}
        </Alert>
      ) : (
        <></>
      )}
      <Calendar
        userInfo={props.userInfo}
        setErrorMailboxes={props.setErrorMailboxes}
        toGetUserEvents={props.toGetUserEvents}
        setAppErrMsg={props.setAppErrMsg}
      />
    </Box>
  );
};

export default Feed;
