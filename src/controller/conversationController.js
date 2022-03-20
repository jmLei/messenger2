const Conversation = require("./models/conversation");

// Creates a conversation document.
/*
    body format = { 
        "name": String, 
        "messages": [] 
    }
*/
const createConversation = (body) => {
    const conversation = new Conversation(body);
    conversation.save((error) => {
        if(error) {
            // Status code to indicate request was received
            // but could not be complete because of conflict
            // with the current state of the resource
            return 409;
        } else {
            // Status code to indicate requested succeeded
            // and new resouce has been created
            return 201; 
        }
    })
}

// Gets a conversation document with a specific id.
const getConversation = (id) => {
    Conversation.findById(id)
        .then((conversation) => {
            return conversation;
        })
        .catch((error) => {
            console.log(error);
        });
};