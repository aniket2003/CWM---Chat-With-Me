const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        max: 70,
        default: "",
    },
    username:{
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    email :{
        type: String,
        require: true,
        unique: true,
        max: 50
    },
    password :{
        type: String,
        required: true,
        min: 8,
    },
    isProfilePicSet : {
        type: Boolean,
    },
    ProfilePic: {
        type: String,
        default: "https://res.cloudinary.com/ds7iiiezf/image/upload/v1727967208/CWM/ProfilePic/Default%20Profile%20Pic.png",
    },
    bio: {
        type: String,
        default: "",
    },
});



module.exports = mongoose.model("Users", userSchema);