const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
        index: true,
    },
    email :{
        type: String,
        required: true,
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

userSchema.index({username: 1});
// userSchema.index({ username: 'text' });

module.exports = mongoose.model("Users", userSchema);