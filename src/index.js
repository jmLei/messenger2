const http = require('http') // Importing http library
const port = 8080

const server = http.createServer((req, res) => {
    res.write("Hello, Node")
    res.end()
})

server.listen(port, (error) => {
    if(error) {
        console.log("Error: ", error)
    } else {
        console.log(`Server listening on port ${port}.`)
    }
})


