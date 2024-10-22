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
const corsOptions = {
  origin: process.env.ORIGIN,
  credentials:true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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

const PORT = 5000; 

server.listen(PORT, () => {
  console.log("Server running on port 5000");
});

setSocket(server);