const http = require("http")         // Importing http library
const mongoose = require("mongoose") // Importing mongoose library
const port = 8080

const server = http.createServer((req, res) => {

})

// Connects to database named "messenger"
// located at localhost:27017
mongoose.connect("mongodb://localhost:27017/messenger")

server.listen(port, (error) => {
    if(error) {
        console.log("Error: ", error)
    } else {
        console.log(`Server listening on port ${port}.`)
    }
})


