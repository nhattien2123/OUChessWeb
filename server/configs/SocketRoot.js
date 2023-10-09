const rootSocket = (io) => {
    let user = 0;

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        socket.token = token;
        next();
    });

    io.on('connection', (socket) => {
        user += 1;
        console.log(user);

        socket.use(([event, ...arg], next) => {
            if (socket.token) {
                next();
            }
        });

        socket.on('disconnect', () => {
            user -= 1;
            console.log(user);
        });

        require("../services/commentInfoService").commentInfoSocket(socket, io);
    });
};

module.exports = rootSocket;
