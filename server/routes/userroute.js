const loginLimiter = require("../middleware/loginlimiter");
const { register, login, fetchuser, refresh, logout, GoogleOAuth, FindUsers, AddFriend, GetFriends, IsAFriend, DeleteFriends} = require("../controllers/usercontroller");
const {getMessages} = require("../controllers/messagecontroller")
const verifyJWT = require("../middleware/verifyJwt")


const router = require("express").Router();
router.post("/register", register);
router.post("/login",loginLimiter,login);
router.get('/GoogleOAuth', loginLimiter, GoogleOAuth);
router.get("/refresh", refresh);
router.post("/logout", logout);
router.post("/getuser",verifyJWT,fetchuser);
router.post("/FindUsers",verifyJWT,FindUsers);
router.post("/AddFriend",verifyJWT,AddFriend);
router.get("/GetFriends",verifyJWT,GetFriends);
router.post("/isafriend",verifyJWT,IsAFriend);
router.post("/getMessages",verifyJWT, getMessages);
router.post("/deleteFriend", verifyJWT, DeleteFriends);

module.exports = router;