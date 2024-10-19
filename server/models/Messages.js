const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },

    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: false,
    },
    messageType:{
        type: String,
        enum: ["text", "file"],
        required: true,
    },
    content: {
        type: String,
        required: function(){
            return this.messageType === "text";
        },
    },
    fileUrl:{
        type: String,
        required: function(){
            return this.messageType === "file";
        },
    },
    timestamp:{
        type: Date,
        default: Date.now,
    },
    read: {
        type: Boolean,
        default: false,
    }
   
});



module.exports = mongoose.model("Messages", messageSchema);