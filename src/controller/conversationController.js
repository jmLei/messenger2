const Conversation = require("./models/conversation");

const getConveration = (id) => {
    Conversation.findById(id)
        .then((conversation) => {
            return conversation;
        })
        .catch((error) => {
            console.log(error);
        });
};