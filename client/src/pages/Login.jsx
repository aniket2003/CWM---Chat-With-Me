import React, { useRef, useState, useEffect } from "react";
import { loginRoute } from "../utils/APIRoute";
import axios from "axios";
import { useLoginMutation } from "../auth/authApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";
import usePersist from "../hooks/usePersist";

function Login() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = useSelector(selectCurrentToken);
  const [persist, setPersist] = usePersist();

  const handleemailChange = (data) => {
    setEmail(data.target.value);
  };

  const handlepassChange = (data) => {
    setPassword(data.target.value);
  };

  const handleToggle = () => {
    setPersist((prev) => !prev);
  };

  const handleSubmit = async (data) => {
    data.preventDefault();
    const resp = await login({ email, password }).unwrap();

    if (resp.status === true) {
      navigate("/chat");
    } else {
    }
  };

  return (
    <div className="signupSection">
      <div className="info">
        <h2>CWM</h2>
        <i className="icon ion-ios-ionic-outline" aria-hidden="true"></i>
        {/* Logo Section */}
      </div>
      <form
        className="signupForm"
        name="signupform"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h2>Sign In</h2>
        <ul className="noBullet">
          <li>
            <input
              type="email"
              className="inputFields"
              id="email"
              name="email"
              placeholder="Email"
              onChange={(e) => handleemailChange(e)}
              required
            />
          </li>
          <li>
            <input
              type="password"
              className="inputFields"
              id="password"
              name="password"
              placeholder="Password"
              onChange={(e) => handlepassChange(e)}
              required
            />
          </li>
          <li id="center-btn">
            <label
              htmlFor="persist"
              style={{
                position: "absolute",
                opacity: "0",
                pointerEvents: "none",
              }}
            >
              <input
                type="checkbox"
                id="persist"
                onChange={handleToggle}
                checked={persist}
              />
              Trust This Device
            </label>

            {/* <input type="submit" id="join-btn" name="join" alt="Join" value="Join"/> */}
            <button id="join-btn" type="submit">
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </li>
        </ul>
      </form>
    </div>
  );
}

export default Login;
