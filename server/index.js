require("dotenv").config(); 
const express = require("express")
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler")
const userRoutes = require('./routes/userroute')
const bodyParser = require("body-parser"); 
const cookieParser = require("cookie-parser")
const setSocket = require("./SocketSetup");
const multer = require('multer');
const http = require("http");

const app = express(); 
const server = http.createServer(app);
const db = require("./db");
db() ; 

const cors = require("cors");
app.use(cors({
  origin: "https://cwm-chat-with-me-zyz7.onrender.com",
  credentials:true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(logger)
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use("/api/auth",userRoutes);

app.use(errorHandler);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});

setSocket(server);