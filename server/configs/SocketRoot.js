const rootSocket = (io) => {
    let userConnected = {};
    const jwt = require("jsonwebtoken");
    let user = 0;

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRETKEY, (err, user) => {
                if (err) {
                    console.log("Lỗi");
                } else {
                    socket.userId = user._id;
                    userConnected[user._id] = socket.id;
                }
            });
            socket.token = token;
        }

        next();
    });

    io.on("connection", (socket) => {
        user += 1;
        console.log("connection - (con): ", userConnected);

        // socket.use(([event, ...arg], next) => {
        //     if (socket.token) {
        //         next();
        //     }
        // });

        socket.on("disconnect", () => {
            user -= 1;
            console.log("connection (dis): ", userConnected);
            if (socket.userId) {
                delete userConnected[socket.userId];
            }
        });

        require("../services/CommentInfoService").commentInfoSocket(socket, io, (error) => {
            socket.emit("error_msg", { error });
        });

        require("../services/FriendService").friendSocket(socket, io, userConnected);
        socket.on(`existingPlayer`, (data) => {
            io.sockets.in(data.roomId).emit(`clientExistingPlayer`, data)
        })

        require("../services/GameService").cameraMove(socket, io);
        require("../services/GameService").disconnect(socket, io);
        require("../services/GameService").leaveRoom(socket, io);
        require("../services/GameService").fetchPlayers(socket, io);
        require("../services/GameService").joinRoom(socket, io);
        require("../services/GameService").makeMove(socket, io);
        require("../services/GameService").resetGame(socket, io);
        require("../services/GameService").sendMessage(socket, io);
        require("../services/GameService").promotePawn(socket, io);
    });
};

module.exports = rootSocket;
