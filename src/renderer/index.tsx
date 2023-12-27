import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

// renders React Component "Root" into the DOM element with ID "root"
ReactDOM.render(<App />, document.getElementById("root"));

// allows for live updating
declare const module: {
  hot: {
    accept: () => void;
  };
};

module.hot.accept();
