const http = require("http");          // Importing http library
const mongoose = require("mongoose");  // Importing mongoose library
const User = require("./models/user"); // Importing user schema
const port = 8080;

// Connects to MongoDB database named "messenger"
// located at localhost:27017
mongoose.connect("mongodb://localhost:27017/messenger")
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

}).listen(port, (error) => {

    if(error) {
        console.log("Error: ", error)
    } else {
        console.log(`Server listening on port ${port}.`)
    }

})