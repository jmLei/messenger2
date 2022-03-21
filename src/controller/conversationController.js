const HelperFunctions = require("../util/helperFunctions");
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
    addMessage: (body, id, res) => {
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
    createConversation: (req, res) => {
        // Using callback functions to execute code in the sequence they are called
        HelperFunctions.parseBody(req, (body) => {
            const conversation = new Conversation(body);
            conversation.save((error) => {
                if(error) {
                    // 409 status code to indicate request was received
                    // but could not be complete because of conflict
                    // with the current state of the resource
                    res.writeHead(409, { "Content-Type": "text/plain" });
                    res.write(error);
                    res.end()
                } else {
                    // 201 status code to indicate requested succeeded
                    // and new resouce has been created
                    res.writeHead(201);
                    res.end();
                }
            })
        });
    },

    // Gets a conversation document with a specific id.
    getConversation: (id, res) => {
        console.log("conversationController.getConversation");
        Conversation.findById(id, (error, document) => {
            if(error) {
                console.log(error);
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.write(error);
                res.end();
            } 
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(document));
                res.end();
            }
        })
    },

}
