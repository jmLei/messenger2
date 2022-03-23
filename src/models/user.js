const mongoose = require("mongoose"); // Importing the mongoose package.

const userSchema = new mongoose.Schema({
    _id: String,                            
    friendList: [{type: String}],
    incomingFriendRequests: [{type: String}],
    outgoingFriendRequests: [{type: String}],
    conversations: [{type: String}] 
});

// Exporting user schema so other files can use it.
module.exports = mongoose.model("User", userSchema);