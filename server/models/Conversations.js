const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({

    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Messages"
    }]

});


module.exports = mongoose.model("Conversations", ConversationSchema);