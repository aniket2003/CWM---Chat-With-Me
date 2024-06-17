require("dotenv").config()  ; 
const express = require("express")
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler")
const userRoutes = require('./routes/userroute')
const cookieParser = require("cookie-parser")

const app = express() ; 
const db = require("./db");
db() ; 

const cors = require("cors");
app.use(cors({
  origin: 'http://localhost:5173',
  credentials:true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(logger)
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", userRoutes);

app.use(errorHandler)
app.listen(5000 , () => {
    console.log("server running on port 5000");
});
