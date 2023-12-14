import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
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
  userInfo: userInfoType | undefined;
  setErrorMailboxes: (addresses: string[]) => void;
  toGetUserEvents: boolean;
};

const updateEvents = async (userInfo: userInfoType): Promise<string[]> => {
  let promises: Promise<string | undefined>[] = [];
  for (const mailbox of userInfo.useraccounts) {
    let p = updateAccountEventsAPI(mailbox.address, mailbox.protocol)
      .then((errMsg) => {
        console.log("error msg for mailbox:", mailbox.address, ":", errMsg);
        return errMsg.length === 0 ? "" : mailbox.address;
      })
      .catch((error) => {
        console.log(error);
        console.log(`fail to update events for mailbox:`, mailbox);
        return mailbox.address;
      });
    promises.push(p);
  }
  let errorousMailboxes = await Promise.all(promises);
  let mailboxes = errorousMailboxes
    .map((addr) => addr as string)
    .filter((address) => address !== "");
  console.log("errorous mailboxes:", mailboxes);
  return mailboxes;
};

const updateAccountEventsAPI = async (
  address: string,
  protocol: string
): Promise<string> => {
  if (protocol === "IMAP" || protocol == "outlook" || protocol == "gmail") {
    return window.electronAPI.update_events(address, {});
  } else {
    throw `un-recognized mailbox type: ${protocol}`;
  }
};

const getEventsAPI = async (): Promise<StringKeyMap[]> => {
  return window.electronAPI
    .get_events()
    .then((resp) => {
      console.log(`events returned`);
      console.log(resp);
      if (!Array.isArray(resp)) {
        console.log(`fail to get events`);
        console.log(resp.errMsg);
        return [];
      }
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
        <Link
          component="button"
          onClick={() => {
            window.electronAPI.browser_open(url);
          }}
          color="inherit"
          key={i + 1}
        >
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
      updateEvents(props.userInfo)
        .then((errMailboxes: string[]) => {
          console.log("Mailboxes in error:", errMailboxes);
          props.setErrorMailboxes(errMailboxes);
        })
        .then(() => {
          getEventsAPI().then((resp) => {
            setEventStore(resp);
          });
        });
    }
  }, [props.userInfo, props.toGetUserEvents, updateTimer]);

  setInterval(() => {
    updateTimer = !updateTimer;
  }, 1000 * 60 * 5);

  useEffect(() => {
    getEventsAPI().then((resp) => {
      console.log("events returned");
      console.log(resp);
      setEventStore(resp);
    });
  }, []);

  useEffect(() => {
    console.log("rerendering");
    console.log("event store length:", eventStore.length);
    if (query === "") {
      setEvents(prepareEventsForCalendar(eventStore));
      return;
    }
    let readyEvents = prepareEventsForCalendar(eventStore);
    updateLocalSearchIndex(readyEvents);
    let matchEvents = localSearch(query);
    setEvents(matchEvents);
  }, [query, eventStore]);

  return (
    // calendar window(head + calendar)
    // XPath: /html/body/div/div/main/div/div[2]/div
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
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
