const { Server } = require("socket.io");

const users = new Map();

const initIOServer = (httpServer) => {
    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log(`${socket.id} joined the room.`);

        socket.on("send-user-id", (userId) => {
            socket.username = userId;
            console.log(`${socket.username} / ${socket.id} connected.`);

            if(! users.has(socket.username)) {
                users.set(socket.username, []);
            }
            users.get(socket.username).push(socket.id);
            console.log(users);
        });

        socket.on("disconnect", () => {
            console.log(socket.username);
            console.log(users.get(socket.username));
            const index = users.get(socket.username).indexOf(socket.id);

            if(index > -1) {
                users.get(socket.username).splice(index, 1);
            }

            console.log(`${socket.username} / ${socket.id} disconnected.`);
            console.log(users);
        })
    });


}

module.exports = initIOServer;