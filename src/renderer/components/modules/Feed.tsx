import React, { useState } from "react";
import Calendar from "./Calendar";
import { userInfoType } from "./SideBar";
import { Box } from "@mui/material";

type FeedProps = {
  userInfo: userInfoType | undefined;
  toGetUserEvents: boolean;
  setErrorMailboxes: (addresses: string[]) => void;
};

const Feed = (props: FeedProps) => {
  return (
    <Box
      sx={{
        width: "80%",
        height: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
      pb="3%"
      pr="3%"
      pl="3%"
      pt={3}
    >
      <Calendar
        userInfo={props.userInfo}
        setErrorMailboxes={props.setErrorMailboxes}
        toGetUserEvents={props.toGetUserEvents}
      />
    </Box>
  );
};

export default Feed;
