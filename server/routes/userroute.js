const {getuser} = require("../middleware/getuser")
const loginLimiter = require("../middleware/loginlimiter");
const { register, login, fetchuser, refresh, logout, GoogleOAuth} = require("../controllers/usercontroller");

const verifyJWT = require("../middleware/verifyJwt")


const router = require("express").Router();
router.post("/register", register);
router.post("/login",loginLimiter,login);
router.get('/GoogleOAuth', loginLimiter, GoogleOAuth);
router.get("/refresh", refresh);
router.post("/logout", logout);
router.post("/getuser",verifyJWT,fetchuser);

module.exports = router;