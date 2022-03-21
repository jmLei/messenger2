const http = require("http");          // Importing http library
const mongoose = require("mongoose");  // Importing mongoose library

const conversationController = require("./controller/conversationController");
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

    // GET localhost:8080/user => Read all users
    if(method === "GET" && resource === "users" && id === "") {
        console.log("GET /users");
    } 
    // GET localhost:8080/user/{id} => Read a user where id = {id}
    else if(method === "GET" && resource === "users" && id !== "") {
        console.log(`GET users/${id}`);
    }
    // HEAD /users/{userId}
    // Check if userId exists.
    // If userId exists, return 200. Else, return 404.
    else if(method === "HEAD" && resource === "users" && id !== "") {
        console.log(`HEAD users/${id}`);
    }
    // POST localhost:8080/user => Create a new user
    else if(method === "POST" && resource === "users") {
        console.log("POST /user")
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
        console.log("PATCH /user");
    }
    // GET /conversations/{conversationId}
    // Retrieves a conversation with a specific conversationId 
    else if(method === "GET" && resource === "conversations" && id !== "") {
        console.log(`GET /conversations/${id}`)
        conversationController.getConversation(id, res);
    }
    // POST /conversations
    // Create a new conversation.
    // Body format: { "name": String, "messages": [] }
    else if(method === "POST" && resource === "conversations") {
        console.log("POST /conversations");
        conversationController.createConversation(req, res);
    }
    // PATCH /conversations/{conversationId}
    // Adds a message to a conversation document.
    else if(method === "PATCH" && resource === "conversations" && id !== "") {
        console.log(`PATCH /conversations/${id}`);
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

})
