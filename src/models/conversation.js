const mongoose = require("mongoose"); // Importing the mongoose package

const messageSchema = new mongoose.Schema({
    timestamp: Date,
    from: String,
    body: String
})

const conversationSchema = new mongoose.Schema({
    name: String,
    messages: [messageSchema]
});

// Exporting conversation model.
// Models are constructors compiled from the schema definition.
module.exports = mongoose.model("Conversation", conversationSchema);
