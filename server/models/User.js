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
        default: false,
    },
    ProfilePic: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
});



module.exports = mongoose.model("Users", userSchema);