const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const register = async (req, res, next) => {
  try {
    const { username, password, email, bio, profilepic } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "Username already used", status: false });
    }

    // const emailCheck = await User.findOne({email });
    // if(emailCheck){
    //     return res.json({msg:"Email already used", status: false});
    // }
    const salt = await bcrypt.genSalt(10);
    const SecuredPass = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      username,
      password: SecuredPass,
      bio,
    });

    const UserData = {
      user: {
        id: user.id,
      },
    };

    const jwtauthtoken = jwt.sign(UserData, ACCESS_TOKEN_SECRET, {
      expiresIn: "60m",
    });
    const refreshToken = jwt.sign(UserData, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
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
      expiresIn: "10s",
    });
    const refreshToken = jwt.sign(UserData, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
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
  console.log(cookies)
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
      expiresIn: "60m",
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

module.exports = { register, login, fetchuser, logout, refresh };
