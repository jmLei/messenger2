const Conversation = require("../models/conversation");

module.exports = {

    // Adds a message to a conversation document.
    /*
        Body format = {
            "timestamp": Date,
            "from": String,
            "body": String"
        }
    */
    addMessage: (body, id) => {
        Conversation.findById(id)
            .then((conversation) => {
                conversation.messages.push(body);
                console.log("Message added.");
            })
            .catch(error => {
                console.log(error);
            })
    },

    // Creates a conversation document.
    /*
        body format = { 
            "name": String, 
            "messages": [] 
        }
    */
    createConversation: (body, res) => {
        const conversation = new Conversation(body);
        conversation.save((error) => {
            if(error) {
                // 409 status code to indicate request was received
                // but could not be complete because of conflict
                // with the current state of the resource
                res.writeHead(409);
                res.write(error);
                res.end()
            } else {
                // 201 status code to indicate requested succeeded
                // and new resouce has been created
                res.writeHead(201);
                res.end();
            }
        })
    },

    // Gets a conversation document with a specific id.
    getConversation: (id) => {
        Conversation.findById(id)
            .then((conversation) => {
                return conversation;
            })
            .catch((error) => {
                console.log(error);
            });
    },

}
