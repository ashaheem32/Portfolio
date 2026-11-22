import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));

// Retire any legacy service worker so visitors receive the current portfolio.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.ready
    .then((registration) => registration.unregister())
    .catch((error) => console.error(error.message));
}
