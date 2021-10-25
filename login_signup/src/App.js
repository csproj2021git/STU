import { React, useState } from "react";
import Loginform from "./Components/LoginForm";

function App() {
  const adminUser = { email: "admin@admin.com", password: "1234" };
  const [user, setUser] = useState({ name: "", email: "" });
  const [logCount, setLogCount] = useState(0);
  const [error, setError] = useState("");
  const login = (details) => {
    if (
      details.email === adminUser.email &&
      details.password === adminUser.password
    ) {
      setUser({ email: details.email, password: details.password });
    } else {
      setError("Incorrect username or password");
      setLogCount(logCount + 1);
    }
  };

  return (
    <div className="App">
      {user.email !== "" ? (
        <div className="welcome">
          <h2>Welcome</h2>
        </div>
      ) : (
        <div className="">
          <Loginform login={login} error={error} logCount={logCount} />
        </div>
      )}
    </div>
  );
}

export default App;
