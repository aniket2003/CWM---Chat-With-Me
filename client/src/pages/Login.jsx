import React, { useRef, useState, useEffect } from "react";
import { useLoginMutation } from "../redux/auth/authApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../redux/auth/authSlice";
import usePersist from "../hooks/usePersist";
import { useLoginWithGoogleMutation } from "../redux/auth/authApiSlice";
import { useGoogleLogin } from "@react-oauth/google";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = useSelector(selectCurrentToken);
  const [persist, setPersist] = usePersist();
  const [GoogleOAuthlogin, { isLoadingGoogle }] = useLoginWithGoogleMutation();
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
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
    setLoading(true);
    try{

      const resp = await login({ email, password }).unwrap();
      
      if (resp.status === true) {
        localStorage.setItem("persist", "true");
        
      }
    }catch(err){

    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/chat");
    }
  }, [currentUser, navigate]);



  const handleGoogleSubmit = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await GoogleOAuthlogin(authResult["code"]).unwrap();
        if (result.status === true) {
            localStorage.setItem("persist", "true");
          navigate("/chat");
        }
      }
    } catch (err) {
      console.error("Error while requesting google code: ", err);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSubmit,
    onError: handleGoogleSubmit,
    flow: "auth-code",
  });

  if (loading) {
    return <Loader />; // Show loader while loading
  }

  return (
    <div className="signupSection">
    <div className="info">
      <h2>CWM</h2>
      <i className="icon ion-ios-ionic-outline" aria-hidden="true"></i>
    </div>
    <form className="signupForm" onSubmit={(e) => handleSubmit(e)}>
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
      </ul>
  
      <div className="buttonsContainer">
        <button id="join-btn" type="submit">
          {isLoading ? "Logging in..." : "Login"}
        </button>
  
        <button onClick={googleLogin} id="join-btn2" type="button">
          {isLoadingGoogle ? "Logging in..." : "Login With Google"}
        </button>
      </div>
    </form>
  </div>
  
  );
}

export default Login;
