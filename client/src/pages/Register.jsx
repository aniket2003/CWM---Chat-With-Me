import React, { useState } from "react";
import { registerRoute } from "../utils/APIRoute";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePersist from "../hooks/usePersist";
import { useLoginWithGoogleMutation } from "../redux/auth/authApiSlice";
import { useGoogleLogin } from "@react-oauth/google";

function Register() {
  const navigate = useNavigate();
  const [persist, setPersist] = usePersist();
  const [GoogleOAuthlogin, { isLoadingGoogle }] = useLoginWithGoogleMutation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [details, setdetails] = useState({
    email: "",
    username: "",
    password: "",
    confirmpassword: "",
    profilepic: null,
    bio: "",
  });

  const handleChange = (data) => {
    setdetails({ ...details, [data.target.name]: data.target.value });
  };

  const validation = (data) => {
    const { email, username, password, confirmpassword, profilepic, bio } =
      data;
  };


  const handleSubmit = async (data) => {
    data.preventDefault();
    const { email, username, password, confirmpassword, profilepic, bio } =
      details;
    const res = await axios.post(registerRoute, {
      email,
      username,
      password,
      confirmpassword,
      profilepic,
      bio,
    });
    try {
      if (res.status) {
        console.log("User Added!");
        navigate("/login");
      } else {
        console.log("User Not Added!");
      }
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };

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



  const resizeImage = (dataUrl, width, height, callback) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL("image/jpeg"));
    };
    img.src = dataUrl;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        resizeImage(reader.result, 500, 500, (resizedImage) => {
          setPreviewImage(resizedImage);
          setdetails({ ...details, profilepic: resizedImage.split(",")[1] }); // storing to Base64 string
        });
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewImage(null);
    }
  };

  return (
    <div className="signupSection">
      <div className="info">
        <h2>CWM</h2>
        <p>Please select a Profile Picture</p>

        <div className="displayProfilePic">
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
        </div>
        <input
          type="file"
          id="profile_pic"
          name="profilepic"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ width: "12rem" }}
        />
      </div>
      <form
        className="signupForm"
        name="signupform"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h2>Sign Up</h2>
        <ul className="noBullet">
          <li>
            <input
              type="text"
              className="inputFields"
              id="username"
              name="username"
              placeholder="Username"
              onChange={(e) => handleChange(e)}
              required
            />
          </li>
          <li>
            <input
              type="email"
              className="inputFields"
              id="email"
              name="email"
              placeholder="Email"
              onChange={(e) => handleChange(e)}
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
              onChange={(e) => handleChange(e)}
              required
            />
          </li>
          <li>
            <input
              type="password"
              className="inputFields"
              id="confirmpassword"
              name="confirmpassword"
              placeholder="Confirm Password"
              onChange={(e) => handleChange(e)}
              required
            />
          </li>
          <li>
            <textarea
              id="bio"
              className="inputFields"
              name="bio"
              maxLength={150}
              style={{ width: "50%", height: "3rem", marginTop: "10px" }}
              placeholder="Write something about yourself..."
              onChange={(e) => handleChange(e)}
            />
          </li>
          <li id="center-btn">
            {/* <input type="submit" id="join-btn" name="join" alt="Join" value="Join"/> */}
          </li>
        </ul>

        <div className="buttonsContainer">
            <button id="join-btn" type="submit">
          Sign Up
            </button>
  
        <button onClick={googleLogin} id="join-btn2" type="button">
          {isLoadingGoogle ? "Signing Up..." : "Sign Up using Google"}
        </button>
      </div>

      </form>
    </div>
  );
}

export default Register;
