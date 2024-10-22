const User = require("../models/User");
const Conversations = require("../models/Conversations");
const Messages = require("../models/Messages");
const Friends = require("../models/Friends");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { oauth2client } = require("../utils/googleConfig");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const cloud_name = process.env.cloud_name;
const cloudinary_api_key = process.env.cloudinary_api_key;
const cloudinary_api_secret = process.env.cloudinary_api_secret;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TO = process.env.ACCESS_TO;
const REFRESH_TO = process.env.REFRESH_TO;

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");
const path = require("path");
const DatauriParser = require("datauri/parser");

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

const SendFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ status: false, message: "No file uploaded." });
  }

  const parser = new DatauriParser();
  const file = parser.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer
  );

  try {
    const result = await cloudinary.uploader.upload(file.content, {
      folder: "CWM/UserUploads",
    });
    // res.send({status : true});
    res.send({ status: true, url: result.secure_url });
  } catch (err) {

    res.status(500).send({ error: "Internal Server Error" });
  }
};

const register = async (req, res, next) => {
  try {
    const { username, password, email, bio, profilepic } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "Username already used", status: false });
    }

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
      sameSite: "strict",
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
    const { tokens } = await oauth2client.getToken(code);
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
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ status: true, authtoken: jwtauthtoken });
  } catch (err) {
    console.log("Error: ", err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
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
      sameSite: "strict",
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

    res.json({ authtoken: accessToken });
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

const FindUsers = async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm;
    const users = await User.find({
      username: { $regex: ".*" + searchTerm + ".*", $options: "i" }, // here the regex will get all the usernames having searchTerm as their substring, "i" will make it case - insensitive ie lowercase uppercase is ignored!!!
    })
      .skip(0)
      .limit(5);
    res.send(users);
  } catch (err) {
    console.log("Error finding the users: ");
  }
};

const AddFriend = async (req, res) => {
  try {
    const { userid, friendid } = req.body;
    const user1 = await User.findById(userid).select(
      "username email ProfilePic bio"
    );
    const user2 = await User.findById(friendid).select(
      "username email ProfilePic bio"
    );

    if (!user2) {
      res.send({ status: false });
    }

    let userFriends1 = await Friends.findOne({ user: userid });
    let userFriends2 = await Friends.findOne({ user: friendid });

    if (!userFriends1) {
      userFriends1 = await Friends.create({ user: userid, friends: [] });
    }

    if (!userFriends2) {
      userFriends2 = await Friends.create({ user: friendid, friends: [] });
    }

    const isAlreadyFriend = userFriends1.friends.some((friends) =>
      friends.friendsId.equals(friendid)
    );

    console.log(user1, "     ", user2);

    if (!isAlreadyFriend) {
      userFriends1.friends.push({
        friendsId: user2._id,
        username: user2.username,
        email: user2.email,
        ProfilePic: user2.ProfilePic,
        bio: user2.bio,
      });
      await userFriends1.save();

      userFriends2.friends.push({
        friendsId: user1._id,
        username: user1.username,
        email: user1.email,
        ProfilePic: user1.ProfilePic,
        bio: user1.bio,
      });
      await userFriends2.save();
    } else {
      console.log("Already a friend");
    }

    res.send({ status: true });
  } catch (err) {
    console.error("Error: ", err);
  }
};

const DeleteFriends = async (req, res) => {
  try {
    const { userid, friendid } = req.body;
    console.log(userid, " ", friendid);

    await Friends.updateOne(
      { user: userid },
      { $pull: { friends: { friendsId: friendid } } }
    );

    await Friends.updateOne(
      { user: friendid },
      { $pull: { friends: { friendsId: userid } } }
    );

    const conversation = await Conversations.findOne({
      participants: { $all: [userid, friendid] },
    });

    if (conversation) {
      console.log("Deleting");
      await Messages.deleteMany({ _id: { $in: conversation.messages } });
      await Conversations.deleteOne({ _id: conversation._id });
    }

    res.send({ status: true });
  } catch (err) {
    console.log("Error: ", err);
    res.send({ status: false });
  }
};

const GetFriends = async (req, res) => {
  try {
    const UserId = req.userid;
    const friends = await Friends.findOne({ user: UserId });

    if (friends) {
      const formatData = await Promise.all(
        
        friends.friends.map(async(friend) => {

          const unreadMessages = await Messages.countDocuments({
            from: friend.friendsId,
            to: UserId,
            read: false,
          });

          return {
            _id: friend.friendsId,
            username: friend.username,
            email: friend.email,
            ProfilePic: friend.ProfilePic,
            bio: friend.bio,
            NumberofUnReadMessages: unreadMessages,
          };
        })


      );



      res.status(200).send(formatData);
    } else {
      res.status(200).send([]);
    }
  } catch (err) {
    console.error("Error: ", err);
  }
};

const IsAFriend = async (req, res) => {
  try {
    const { userid, friendid } = req.body;
    console.log("IDs: ", userid, "   ", friendid);
    const user = await Friends.findOne({
      user: userid,
      friends: {
        $elemMatch: { friendsId: friendid },
      },
    });

    if (user) {
      res.send({ status: true });
    } else {
      res.send({ status: false });
    }
  } catch (err) {
    console.error("Error: ", err);
  }
};


const Message = async(req,res)=>{
  const {from, to, message} = req.body;

  try{

    let conversation = await Conversations.findOne({
      participants: {$all : [from , to]},
    });

    if(!conversation){
      conversation = await Conversations.create({
        participants : [from, to],
      })
    }
    
    const Message = await Messages.create({
      from : from,
      to : to,
      messageType : "text",
      content: message,
  });
  
  if(Message){
    conversation.messages.push(Message._id);
    await conversation.save();
  }

  res.status(200).send({status: true});

}catch(err){
  res.status(500).send({status: false});
  console.log(err);
}
};

const ReadAllMessages = async(req,res)=>{

  try{

    const {from , to} = req.body;
    console.log(from, "  ", to );
    console.log("DOing");
    await Messages.updateMany(
      {from , to , read: false},
      {$set: {read: true}}
    );
    console.log("DOne");
    res.status(200).send({status: true});

  }catch(err){
    res.status(500).send({status: false, message: err});
  }

}


module.exports = {
  register,
  login,
  fetchuser,
  logout,
  refresh,
  GoogleOAuth,
  FindUsers,
  AddFriend,
  GetFriends,
  IsAFriend,
  DeleteFriends,
  SendFile,
  Message,
  ReadAllMessages,
};
