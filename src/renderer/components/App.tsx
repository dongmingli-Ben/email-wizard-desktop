import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";

import { ThemeProvider, createTheme } from "@mui/material/styles";

// MSAL imports
import { MsalProvider } from "@azure/msal-react";
import { IPublicClientApplication } from "@azure/msal-browser";

// to use styles, import the necessary CSS files
import "../utility.css";
import IntroPage from "./pages/IntroPage";
import NotFound from "./pages/NotFound";
import { tryLoadUserCredentials } from "../utilities/credentialUtility";

const theme = createTheme({
  typography: {
    fontFamily: `"Open Sans", sans-serif`,
    fontWeightRegular: 400,
  },
});

type AppProps = {
  pca: IPublicClientApplication;
};

/**
 * Define the "App" component as a function.
 */
const App = ({ pca }: AppProps) => {
  return (
    // <> is like a <div>, but won't show
    // up in the DOM tree
    <MsalProvider instance={pca}>
      <ThemeProvider theme={theme}>
        <div className="app-container body">
          <Routes>
            <Route path="/" element={<CalendarPage />} />
            {/* <Route path="/" element={<IntroPage />} /> */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </div>
      </ThemeProvider>
    </MsalProvider>
  );
};

export default App;
