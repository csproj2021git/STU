import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./containers/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
// if(!localStorage.jwtToken){
//   window.location.href = "http://localhost:5000"
// }
// else{
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
// }
