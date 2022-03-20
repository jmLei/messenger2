const mongoose = require("mongoose"); // Importing the mongoose package

const conversationSchema = new mongoose.Schema({
    _id: mongoose.ObjectId,
    name: String,
    messages: { 
        timestamp: Date, 
        from: String,
        body: String
    }
});

// Exporting conversation schema.
modules.export = mongoose.model("Conversation", conversationSchema);