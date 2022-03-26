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
        });

        socket.on("accept-friend-request", (ids) => {
            for(let i = 0; i < users.get(ids[1]).length; i++) {
                io.to(users.get(ids[1])[i]).emit("friend-request-accepted", ids[0]);
            }
        });

        socket.on("cancel-friend-request", (ids) => {
            for(let i = 0; i < users.get(ids[1]).length; i++) {
                io.to(users.get(ids[1])[i]).emit("friend-request-cancelled", ids[0]);
            }
        });

        socket.on("join-conversation", (friendId, conversationId) => {
            for(let i = 0; i < users.get(friendId).length; i++) {
                io.to(users.get(friendId)[i]).emit("conversation-joined", conversationId);
            }
        })

        socket.on("reject-friend-request", (ids) => {
            for(let i = 0; i < users.get(ids[1]).length; i++) {
                io.to(users.get(ids[1])[i]).emit("friend-request-rejected", ids[0]);
            }
        })

        socket.on("send-friend-request", (ids) => {
            for(let i = 0; i < users.get(ids[1]).length; i++) {
                io.to(users.get(ids[1])[i]).emit("friend-request-received", ids[0]);
            }
        });

        socket.on("send-message", (conversationId, participants, message) => {

            for(let j = 0; j < participants.length; j++) {
                if(participants[j] !== message.from) {
                    for(let i = 0; i < users.get(participants[j]).length; i++) {
                        io.to(users.get(participants[j])[i]).emit("message-received", conversationId, message);
                    }
                }
            }
        })
    });
}

module.exports = initIOServer;