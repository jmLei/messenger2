const mongoose = require("mongoose"); // Importing the mongoose package

const conversationSchema = new mongoose.Schema({
    name: String,
    messages: [
        { 
            timestamp: Date, 
            from: String,
            body: String
        }
    ]
});

// Exporting conversation schema.
module.exports = mongoose.model("Conversation", conversationSchema);
