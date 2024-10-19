const loginLimiter = require("../middleware/loginlimiter");
const {
  register,
  login,
  fetchuser,
  refresh,
  logout,
  GoogleOAuth,
  FindUsers,
  AddFriend,
  GetFriends,
  IsAFriend,
  DeleteFriends,
  SendFile,
  Message,
  ReadAllMessages,
} = require("../controllers/usercontroller");
const { getMessages } = require("../controllers/messagecontroller");
const verifyJWT = require("../middleware/verifyJwt");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  // limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
}).single("file");

const router = require("express").Router();
router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/GoogleOAuth", loginLimiter, GoogleOAuth);
router.get("/refresh", refresh);
router.post("/logout", logout);
router.post("/getuser", verifyJWT, fetchuser);
router.post("/FindUsers", verifyJWT, FindUsers);
router.post("/AddFriend", verifyJWT, AddFriend);
router.get("/GetFriends", verifyJWT, GetFriends);
router.post("/isafriend", verifyJWT, IsAFriend);
router.post("/deleteFriend", verifyJWT, DeleteFriends);
router.post("/getMessages", verifyJWT, getMessages);
router.post("/ReadAllMessages", verifyJWT, ReadAllMessages);
router.post("/Message", verifyJWT, Message);
router.post("/SendFile", verifyJWT, upload, SendFile);

module.exports = router;
