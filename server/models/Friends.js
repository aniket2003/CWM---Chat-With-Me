const mongoose = require("mongoose");

const friendsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    friends: [
        {
            friendsId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },    
            username:{
                type: String,
                required: true,
            },
            email :{
                type: String,
                required: true,
            },
            ProfilePic: {
                type: String,
                default: "https://res.cloudinary.com/ds7iiiezf/image/upload/v1727967208/CWM/ProfilePic/Default%20Profile%20Pic.png",
            },
            bio: {
                type: String,
                default: "",
            },

        }
    ]
});

module.exports = mongoose.model("Friends", friendsSchema);