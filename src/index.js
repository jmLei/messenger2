const http = require("http")         // Importing http library
const mongoose = require("mongoose") // Importing mongoose library
const User = require("./models/user") // Importing user schema
const port = 8080

// Connects to MongoDB database named "messenger"
// located at localhost:27017
mongoose.connect("mongodb://localhost:27017/messenger")
const db = mongoose.connection

db.on("error", (error) => {
    console.log("Error: ", error)
})

db.once("open", () => {
    console.log("Connected to MongoDB database.")
})

const server = http.createServer((req, res) => {

    // Routes
    const url = req.url
    const method = req.method

    if(url === "/user" && method === "GET") {

        console.log("GET /user")

        User.find().then((users) => {

            res.writeHead(200, {"Content-Type": "application/json"})
            res.write(JSON.stringify(users))
            res.end()

        })

    } else if(url === "/user" && method === "POST") {

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

    } else {

        res.writeHead(404, {"Content-Type": "text/html"})
        res.write("No route found.")
        res.end()

    }

}).listen(port, (error) => {

    if(error) {
        console.log("Error: ", error)
    } else {
        console.log(`Server listening on port ${port}.`)
    }

})