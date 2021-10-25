import React, { useState } from "react";

function Loginform({ login, error, logCount }) {
  const [details, setDetails] = useState({ email: "", password: "" });

  const submitHandler = (e) => {
    e.preventDefault();
    login(details);
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="form-inner">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
            value={details.email}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) =>
              setDetails({ ...details, password: e.target.value })
            }
            value={details.password}
          />
        </div>
        <input type="submit" value="Login" />
      </div>
      {error}
      <div className="">{logCount > 3 && <a href="">Reset Password</a>}</div>
    </form>
  );
}

export default Loginform;
