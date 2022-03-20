const http = require("http");          // Importing http library
const mongoose = require("mongoose");  // Importing mongoose library
const User = require("./models/user"); // Importing user schema
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

        User.find().then((users) => {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify(users));
            res.end();
        });
    } 
    // GET localhost:8080/user/{id} => Read a user where id = {id}
    else if(method === "GET" && resource === "users" && id !== "") {
        console.log(`GET users/${id}`);

        User.findById(id).then((user) => {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify(user));
            res.end();
        })
    }
    // HEAD /users/{userId}
    // Check if userId exists.
    // If userId exists, return 200. Else, return 404.
    else if(method === "HEAD" && resource === "users" && id !== "") {
        // TODO
    }
    // POST localhost:8080/user => Create a new user
    else if(method === "POST" && resource === "users") {

        console.log("POST /user")

        // Request implements ReadableStream interface
        // To get request body, read data from the stream
        let body = []

        req.on("data", (chunk) => {
            body.push(chunk)
        }).on("end", () => {
            body = Buffer.concat(body).toString()
            body = JSON.parse(body)

            // Inserting user into MongoDB database.
            const user = new User(body)
            user.save((error) => {
                if(error) {
                    console.log("Error: ", error)
                    res.writeHead(400)
                    res.end()
                } else {
                    res.writeHead(200)
                    res.end()
                }
            })
            
        }).on("error", (error) => {
            console.log("Error: ", error)
        })

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
        let body = [];

        req.on("data", (chunk) => {
            body.push(chunk);
        }).on("end", () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body);
            
            const op = body.op;
            const path = body.path;
            const value = body.value;

            console.log(`op = ${op}`);
            console.log(`path = ${path}`);
            console.log(`value = ${value}`);

            if(op === "add") {
                
            }
        })
    }
    // GET /conversations/{conversationId}
    // Retrieves a conversation with a specific conversationId 
    else if(method === "GET" && resource === "conversations" && id !== "") {
        
    }

}).listen(port, (error) => {

    if(error) {
        console.log("Error: ", error)
    } else {
        console.log(`Server listening on port ${port}.`)
    }

})
