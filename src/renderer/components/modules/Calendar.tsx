import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { appGet, appPost, backendConfig } from "../../utilities/requestUtility";
import { getAccessToken } from "../../utilities/verifyEmail";
import { userInfoType } from "./SideBar";
import { Box, Button, Link, Tooltip, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CelebrationIcon from "@mui/icons-material/Celebration";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PlaceIcon from "@mui/icons-material/Place";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import {
  localSearch,
  updateLocalSearchIndex,
} from "../../utilities/searchUtility";

type calendarProps = {
  userId: number;
  userSecret: string;
  userInfo: userInfoType | undefined;
  setErrorMailboxes: (addresses: string[]) => void;
  toGetUserEvents: boolean;
};

const updateEvents = async (
  userId: number,
  userSecret: string,
  userInfo: userInfoType
): Promise<string[]> => {
  let promises: Promise<string | undefined>[] = [];
  for (const mailbox of userInfo.useraccounts) {
    let p = updateAccountEventsAPI(
      userId,
      userSecret,
      mailbox.address,
      mailbox.protocol
    )
      .then(() => {
        return "";
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(`fail to update events for mailbox:`, mailbox);
        if (error.response.status != 504) {
          return mailbox.address;
        }
        return "";
      });
    promises.push(p);
  }
  let errorousMailboxes = await Promise.all(promises);
  let mailboxes = errorousMailboxes
    .map((addr) => addr as string)
    .filter((address) => address !== "");
  return mailboxes;
};

const updateAccountEventsAPI = async (
  userId: number,
  userSecret: string,
  address: string,
  protocol: string
): Promise<void> => {
  if (protocol === "IMAP" || protocol == "POP3" || protocol == "gmail") {
    return appPost(
      backendConfig.events,
      { userId: userId, userSecret: userSecret },
      {
        address: address,
        kwargs: {},
      }
    );
  } else if (protocol == "outlook") {
    let access_token = await getAccessToken(address);
    if (access_token.length === 0) {
      console.log("fail to get access token, got: ", access_token);
      return;
    }
    return appPost(
      backendConfig.events,
      { userId: userId, userSecret: userSecret },
      {
        address: address,
        kwargs: {
          auth_token: access_token,
        },
      }
    );
  } else {
    throw `un-recognized mailbox type: ${protocol}`;
  }
};

const getEventsAPI = async (
  userId: number,
  userSecret: string,
  query: string
): Promise<{ [key: string]: any }[]> => {
  return appGet(
    backendConfig.events,
    { userId: userId, userSecret: userSecret },
    {
      query: query,
    }
  )
    .then((resp) => {
      console.log(`events returned`);
      console.log(resp);
      return resp;
    })
    .catch((e) => {
      console.log("fail to get user events:", e);
      return [];
    });
};

const EventPopupDisplay = ({ event }: { event: { [key: string]: string } }) => {
  const getLocalTime = (time: string) => {
    let localtime = time.split(" ")[0].split("T")[1];
    return localtime.split(":").slice(0, 2).join(":");
  };

  const processURLinVenue = (venue: string) => {
    let expression =
      /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=;!\$]*)/g;
    let place: React.JSX.Element[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let i = 0;
    while ((match = expression.exec(venue)) !== null) {
      const url = match[0];
      const index = match.index;
      place = [
        ...place,
        <span key={i}> {venue.substring(lastIndex, index)} </span>,
        <Link href={url} color="inherit" key={i + 1}>
          URL Link
        </Link>,
      ];
      lastIndex = index + url.length;
      i += 2;
    }
    if (lastIndex !== venue.length) {
      place = [...place, <span key={i}> {venue.substring(lastIndex)}</span>];
    }
    return <>{place}</>;
  };

  console.log(event);
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box pr={1}>
          {event.event_type === "registration" ? (
            <HowToRegIcon></HowToRegIcon>
          ) : (
            <CelebrationIcon></CelebrationIcon>
          )}
        </Box>
        <Typography>{event.summary}</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box pr={1}>
          <ScheduleIcon></ScheduleIcon>
        </Box>
        {"start_time" in event ? (
          <Typography>
            {getLocalTime(event.start_time)} - {getLocalTime(event.end_time)}
          </Typography>
        ) : (
          <Typography>{getLocalTime(event.end_time)}</Typography>
        )}
      </Box>
      {event.venue === undefined ||
      event.venue === "" ||
      event.venue === "unspecified" ? (
        <></>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box pr={1}>
            <PlaceIcon></PlaceIcon>
          </Box>
          <Typography>{processURLinVenue(event.venue)}</Typography>
        </Box>
      )}
    </Box>
  );
};

const CustomEvent = ({ event }: { event: any }) => {
  const e = event.extendedProps.event;
  // console.log(e);
  return (
    <Tooltip
      title={<EventPopupDisplay event={e}></EventPopupDisplay>}
      placement="right"
      sx={{
        width: "inherit",
      }}
    >
      <Box
        sx={{
          fontSize: "inherit",
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          width: "100%",
          boxSizing: "border-box",
          "&:hover": {
            cursor: "default",
          },
        }}
      >
        <FiberManualRecordIcon fontSize="inherit"></FiberManualRecordIcon>
        <Typography
          fontSize="inherit"
          noWrap
          sx={{
            width: "100%",
          }}
        >
          {e.summary}
        </Typography>
      </Box>
    </Tooltip>
  );
};

function SearchBar({ setQuery }: { setQuery: (query: string) => void }) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log("query:", data.get("query") as string);
    setQuery(data.get("query") as string);
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        maxWidth: "40%",
      }}
      onSubmit={handleSubmit}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Events"
        inputProps={{ "aria-label": "search events" }}
        name="query"
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

const HeaderToolBar = ({
  calendarRef,
  setQuery,
}: {
  calendarRef: any;
  setQuery: (query: string) => void;
}) => {
  const [title, setTitle] = useState<string>("");

  const updateTitle = () => {
    let date = new Date(calendarRef.current.getApi().getDate());
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    setTitle(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
  };

  useEffect(() => {
    updateTitle();
  }, [calendarRef]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        mb: 2,
      }}
    >
      <Typography
        variant="h5"
        noWrap
        width="20%"
        sx={{
          fontWeight: "bold",
        }}
      >
        {title}
      </Typography>
      <SearchBar setQuery={setQuery} />
      <Box
        sx={{
          width: "30%",
          display: "flex",
          justifyContent: "flex-end",
          color: "secondary.main",
        }}
      >
        <Button
          onClick={() => {
            calendarRef.current.getApi().today();
            updateTitle();
          }}
          color="inherit"
        >
          Today
        </Button>
        <Button
          onClick={() => {
            calendarRef.current.getApi().prev();
            updateTitle();
          }}
        >
          Prev
        </Button>
        <Button
          onClick={() => {
            calendarRef.current.getApi().next();
            updateTitle();
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

const Calendar = (props: calendarProps) => {
  const [eventStore, setEventStore] = useState<{ [key: string]: string }[]>([]);
  const [events, setEvents] = useState<{ [key: string]: any }[]>([]);
  const [query, setQuery] = useState<string>("");
  const calendarRef = useRef(null);

  const receivedEvents: { [key: string]: any }[] = [];
  let receivedNewEvents: boolean = false;
  let updateTimer: boolean = true;

  const prepareEventsForCalendar = (rawEvents: { [key: string]: string }[]) => {
    let events: { [key: string]: any }[] = [];
    for (const e of rawEvents) {
      if ("end_time" in e && e.end_time != "unspecified") {
        let startTime = "start_time" in e ? e.start_time : e.end_time;
        events = [
          ...events,
          {
            title: e.summary,
            start: startTime.split(" ")[0],
            end: e.end_time.split(" ")[0],
            extendedProps: {
              event: e,
            },
          },
        ];
      }
    }
    console.log("parsed events:");
    console.log(events);
    return events;
  };

  useEffect(() => {
    console.log("updating events for:", props.userInfo);
    if (props.userInfo !== undefined) {
      updateEvents(props.userId, props.userSecret, props.userInfo).then(
        (errMailboxes: string[]) => {
          console.log("Mailboxes in error:", errMailboxes);
          props.setErrorMailboxes(errMailboxes);
        }
      );
    }
  }, [props.userInfo, props.toGetUserEvents, updateTimer]);

  setInterval(() => {
    updateTimer = !updateTimer;
  }, 1000 * 60 * 5);

  useEffect(() => {
    // initiate a websocket connection
    if (props.userId <= 0 || props.userSecret.length === 0) {
      console.log("not logged in, skip websocket connection");
      return;
    }
    const ws = new WebSocket(
      backendConfig.ws.replace("{userId}", props.userId.toString())
    );
    ws.addEventListener("open", (event) => {
      console.log("connected to websocket, sending authenication");
      ws.send(props.userSecret);
      console.log("sent authenication");
    });
    ws.addEventListener("message", (message) => {
      // console.log("received message from websocket");
      // console.log(message);
      let event = JSON.parse(message.data);
      receivedEvents.push(event);
      receivedNewEvents = true;
    });
    ws.addEventListener("close", (event) => {
      console.log("websocket closed");
    });
    return () => {
      ws.close();
    };
  }, [props.userId, props.userSecret]);

  setInterval(() => {
    if (receivedNewEvents) {
      console.log("received new events:", receivedEvents.length);
      setEventStore([...receivedEvents]); // need to recreate the array, otherwise useEffect won't be triggered
      // see https://stackoverflow.com/a/54621059/22896924
      console.log("event store updated, length:", eventStore.length);
      receivedNewEvents = false;
      updateLocalSearchIndex(eventStore);
    }
  }, 500);

  useEffect(() => {
    console.log("rerendering");
    console.log("event store length:", eventStore.length);
    if (query === "") {
      setEvents(prepareEventsForCalendar(eventStore));
      return;
    }
    let matchEvents = localSearch(query);
    let readyEvents = prepareEventsForCalendar(matchEvents);
    setEvents(readyEvents);
  }, [query, eventStore]);

  return (
    <Box sx={{ width: "100%" }}>
      <HeaderToolBar calendarRef={calendarRef} setQuery={setQuery} />
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        headerToolbar={false}
        eventBackgroundColor="white"
        eventContent={(arg) => <CustomEvent event={arg.event} />}
      />
    </Box>
  );
};

export default Calendar;
