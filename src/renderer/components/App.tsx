import React from "react";
import CalendarPage from "./pages/CalendarPage";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// to use styles, import the necessary CSS files
import "../utility.css";

const theme = createTheme({
  typography: {
    fontFamily: `"Open Sans", sans-serif`,
    fontWeightRegular: 400,
  },
});

/**
 * Define the "App" component as a function.
 */
const App = () => {
  return (
    // <> is like a <div>, but won't show
    // up in the DOM tree
    <ThemeProvider theme={theme}>
      <CalendarPage />
    </ThemeProvider>
  );
};

export default App;
