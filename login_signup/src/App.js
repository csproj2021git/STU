import { React, useState } from "react";
import Loginform from "./Components/LoginForm";

function App() {
  const adminUser = { email: "admin@admin.com", password: "1234" };
  const [user, setUser] = useState({ name: "", email: "" });
  const [error, setError] = useState("");

  const login = (details) => console.log(details);

  const logout = (details) => console.log(details);

  return (
    <div className="App">
      <Loginform login={login} error={error} />
    </div>
  );
}

export default App;
