const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { oauth2client } = require("../utils/googleConfig");
const cloudinary = require("cloudinary").v2;
const cloud_name = process.env.cloud_name;
const cloudinary_api_key = process.env.cloudinary_api_key;
const cloudinary_api_secret = process.env.cloudinary_api_secret;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TO = process.env.ACCESS_TO;
const REFRESH_TO = process.env.REFRESH_TO;

cloudinary.config({
  cloud_name: cloud_name,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
});

const Cloudinary_Options = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

const UploadImage = async (profilepic) => {
  try {
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${profilepic}`,
      {
        folder: "CWM/ProfilePic",
      }
    );
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, password, email, bio, profilepic } = req.body;

    const usernameCheck = await User.findOne({ username });
    // if (usernameCheck) {
    //   return res.json({ msg: "Username already used", status: false });
    // }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "Email already used", status: false });
    }
    const ImageLink = await UploadImage(profilepic);
    const salt = await bcrypt.genSalt(10);
    const SecuredPass = await bcrypt.hash(password, salt);
    var isProfilePicSet = false;
    if (ImageLink) {
      isProfilePicSet = true;
    }
    const user = await User.create({
      email,
      username,
      password: SecuredPass,
      ProfilePic: ImageLink,
      isProfilePicSet: isProfilePicSet,
      bio,
    });

    const UserData = {
      user: {
        id: user.id,
      },
    };

    const jwtauthtoken = jwt.sign(UserData, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TO,
    });
    const refreshToken = jwt.sign(UserData, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TO,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      // sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    delete user.password;
    return res.json({ status: true, authtoken: jwtauthtoken });
  } catch (err) {
    next(err);
  }
};

const GoogleOAuth = async (req, res, next) => {
  console.log("in the server!!!");

  try {
    const { code } = req.query;
    console.log("Code: ", code);
    const { tokens } = await oauth2client.getToken(code);
    console.log("Getting!!!!!!");
    oauth2client.setCredentials(tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;

    let checkuser = await User.findOne({ email });

    let id = "";
    const hashedPassword = await bcrypt.hash(JWT_SECRET, 10);
    if (!checkuser) {
      const user = await User.create({
        username: name,
        email: email,
        password: hashedPassword,
        ProfilePic: picture,
        isProfilePicSet: true,
      });
      id = user.id;
    } else {
      id = checkuser.id;
    }

    const UserData = {
      user: {
        id: id,
      },
    };

    const jwtauthtoken = jwt.sign(UserData, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TO,
    });
    const refreshToken = jwt.sign(UserData, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TO,
    });
    res.cookie("jwt", refreshToken, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      // sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ status: true, authtoken: jwtauthtoken });
  } catch (err) {
    console.log("Error: ", err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, tmp } = req.body;
    const emailCheck = await User.findOne({ email });
    if (!emailCheck) {
      return res.json({ msg: "Incorrect username or password", status: false });
    }
    const isPasswordValid = await bcrypt.compare(password, emailCheck.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect username or password", status: false });
    }

    const UserData = {
      user: {
        id: emailCheck.id,
      },
    };

    const jwtauthtoken = jwt.sign(UserData, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TO,
    });
    const refreshToken = jwt.sign(UserData, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TO,
    });
    res.cookie("jwt", refreshToken, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      // sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    delete emailCheck.password;
    return res.json({ status: true, authtoken: jwtauthtoken });
  } catch (err) {
    console.log("error");
    next(err);
  }
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  res.clearCookie("jwt");
  res.json({ message: "Logged out & Cookie Cleared" });
};

const refresh = (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.status(401).json({ message: "unauthorized" });

  const refreshToken = cookies.jwt;
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ message: `Forbidden ${refreshToken}, decoded ${decoded}` });
    const foundUser = await User.findById(decoded.user.id).select("-password");
    if (!foundUser) return res.status(401).json({ message: "Unauthorized" });
    const UserData = {
      user: {
        id: decoded.user.id,
      },
    };
    const accessToken = jwt.sign(UserData, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TO,
    });

    res.json({ accessToken });
  });
};

const fetchuser = async (req, res, next) => {
  try {
    const userId = req.userid;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { register, login, fetchuser, logout, refresh, GoogleOAuth };
