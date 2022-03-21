const HelperFunctions = require("../util/helperFunctions");
const User = require("../models/user");

module.exports = {
    // Creates a user document.
    // Body format = { id: String, friendList: [], friendRequests: [], conversations: [] }
    createUser: (req, res) => {
        HelperFunctions.parseBody(req, (body) => {
            const user = new User(body);
            user.save((error) => {
                if(error) {
                    res.writeHead(409, { "Content-Type": "text/plain" });
                    res.write(error);
                    res.end();
                } else {
                    res.writeHead(201);
                    res.end();
                }
            })
        })
    },

    // Gets a user document with a specific id.
    getUser: (id, res) => {
        console.log("userController.getUser");
        User.findById(id, (error, document) => {
            if(error) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.write(error);
                res.end();
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(document));
                res.end();
            }
        })
    },
};