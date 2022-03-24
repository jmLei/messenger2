const http = require("http");         
const fs = require("fs");         
const mongoose = require("mongoose");

// Importing controllers
const conversationController = require("./controller/conversationController");
const userController = require("./controller/userController");

const HelperFunctions = require("./util/helperFunctions");

const port = 8080;

// Connects to MongoDB database named "messenger"
// located at localhost:27017
mongoose.connect("mongodb://127.0.0.1:27017/messenger")
const db = mongoose.connection

db.on("error", (error) => {
    console.log("Error: ", error);
});

db.once("open", () => {
    console.log("Connected to MongoDB database.");
});

const server = http.createServer((req, res) => {

    // Routes
    const url = req.url.split("/");

    const method = req.method;
    const resource = (1 < url.length) ? url[1] : "";
    const id = (2 < url.length) ? url[2] : "";

    console.log(url);

    if(req.url === "/" || req.url === "/index.html") {
        fs.readFile("./src/static/index.html", (error, html) => {
            if(error) {
                console.log(error);
            } else {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(html);
                res.end();
            }
        });
    }
    else if(req.url === "/chatroom.html") {
        fs.readFile("./src/static/chatroom.html", (error, html) => {
            if(error) {
                console.log(error);
            } else {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(html);
                res.end();
            }
        });
    }
    else if(req.url === "/css/styles.css") {
        fs.readFile("./src/static/css/styles.css", (error, css) => {
            if(error) {
                console.log(error);
            } else {
                res.writeHead(200, {"Content-Type": "text/css"});
                res.write(css);
                res.end();
            }
        });
    }
    else if(req.url === "/scripts/index.js") {
        fs.readFile("./src/static/scripts/index.js", (error, js) => {
            if(error) {
                console.log(error);
            } else {
                res.writeHead(200, {"Content-Type": "text/javascript"});
                res.write(js);
                res.end();
            }
        })
    }
    else if(req.url === "/scripts/chatroom.js") {
        fs.readFile("./src/static/scripts/chatroom.js", (error, js) => {
            if(error) {
                console.log(error);
            } else {
                res.writeHead(200, {"Content-Type": "text/javascript"});
                res.write(js);
                res.end();
            }
        })
    }
    else if(req.url === "/scripts/user.js") {
        fs.readFile("./src/static/scripts/user.js", (error, js) => {
            if(error) {
                console.log(error);
            } else {
                res.writeHead(200, {"Content-Type": "text/javascript"});
                res.write(js);
                res.end();
            }
        })
    }
    // GET localhost:8080/user/{id} => Read a user where id = {id}
    else if(method === "GET" && resource === "users" && id !== "") {
        userController.getUser(id, res);
    }
    // HEAD /users/{userId}
    // Check if userId exists.
    // If userId exists, return 200. Else, return 404.
    else if(method === "HEAD" && resource === "users" && id !== "") {
        console.log(`HEAD /users/${id}`);
        userController.userExists(id, res);
    }
    // POST localhost:8080/user => Create a new user
    else if(method === "POST" && resource === "users") {
        userController.createUser(req, res);
    }
    // PATCH localhost:8080/user => Partially updates an existing user
    // body must contain op, path, and value fields
    // op is the operation: 
    // "add" adds value into an object or array
    // "remove" removes a value from an object or array
    // "replace" replaces a value
    // "copy" copies a value from one location to another
    // "move" moves a value from one location to another
    // "test" tests for equality with a value from a different location
    // path is the field being modified
    // value is the value used with the operation
    else if(method === "PATCH" && resource === "users" && id !== "") {
        HelperFunctions.parseBody(req, (body) => {
            const op = body.op;
            const path = body.path;
            const value = body.value;

            console.log(`op = ${op}`);
            console.log(`path = ${path}`);

            if(op === "add" && path === "/friend-list") {
                userController.addFriend(value, id, res);
            }
            else if(op === "add" && path === "/incoming-friend-requests") {
                userController.addIncomingFriendRequest(value, id, res);
            }
            else if(op === "add" && path === "/outgoing-friend-requests") {
                userController.addOutgoingFriendRequest(value, id, res);
            }
            else if(op === "add" && path === "/conversations") {
                userController.addConversation(value, id, res);
            }
            else if(op === "remove" && path === "/incoming-friend-requests") {
                userController.removeIncomingFriendRequest(value, id, res);
            }
            else if(op === "remove" && path === "/outgoing-friend-requests") {
                userController.removeOutgoingFriendRequest(value, id, res);
            }
        });
    }
    // GET /conversations/{conversationId}
    // Retrieves a conversation with a specific conversationId 
    else if(method === "GET" && resource === "conversations" && id !== "") {
        conversationController.getConversation(id, res);
    }
    // POST /conversations
    // Create a new conversation.
    // Body format: { "name": String, "messages": [] }
    else if(method === "POST" && resource === "conversations") {
        conversationController.createConversation(req, res);
    }
    // PATCH /conversations/{conversationId}
    // Adds a message to a conversation document.
    else if(method === "PATCH" && resource === "conversations" && id !== "") {
        HelperFunctions.parseBody(req, (body) => {

            const op = body.op;
            const path = body.path;
            const value = body.value;

            if(op === "add" && path === "/messages") {
                conversationController.addMessage(value, id, res);
            }
        });
    }
}).listen(port, (error) => {
    if(error) {
        console.log("Error: ", error)
    } else {
        console.log(`Server listening on port ${port}.`)
    }
});
