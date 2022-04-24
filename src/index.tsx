import React from "react";
// @ts-ignore
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

window.addEventListener("message", function onWebpackMessage(e) {
  console.log("=================================");
  // console.clear()
});

window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
}, false);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);