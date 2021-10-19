import { React, useState } from "react";
import Loginform from "./Components/LoginForm";

function App() {
  const adminUser = { email: "admin@admin.com", password: "1234" };
  const [user, setUser] = useState({ name: "", email: "" });
  const [error, setError] = useState("");

  const Login = (details) => {
    console.log(details);
  };

  const Logout = (details) => {
    console.log(details);
  };

  return (
    <div className="App">
      <Loginform />
    </div>
  );
}

export default App;
