module.exports = {
    // Consumes a HTTP request, then returns the body in JSON format.
    // req = the http request
    // body = body from the http request in JSON format
    parseBody: (req, callback) => {

        let body = [];
        
        req.on("data", (chunk) => {
            body.push(chunk);
        })
        .on("end", () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body);
            callback(body);
        })
    },
}
