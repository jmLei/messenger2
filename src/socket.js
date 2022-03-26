const { Server } = require("socket.io");

const initIOServer = (httpServer) => {
    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log(`${socket.id} joined the room.`);
    })
}

module.exports = initIOServer;