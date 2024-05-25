const crypto = require('crypto');

const rootSocket = (io) => {
    let userConnected = [];
    let rooms = new Array();
    const jwt = require('jsonwebtoken');
    let userCount = 0;

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRETKEY, (err, user) => {
                if (err) {
                    return;
                } else {
                    socket.token = token;
                    socket.userId = user._id;
                    userConnected[user._id] = {
                        detail: { ...socket.handshake.auth.userInfo },
                        socket: socket.id,
                    };
                }
            });
        } else {
            return;
        }

        next();
    });

    io.on('connection', (socket) => {
        userCount += 1;

        socket.on('disconnect', () => {
            userCount -= 1;
            if (socket.handshake.auth.detail) {
                socket.broadcast.to(socket.handshake.auth.detail.id).emit('opponent-disconnect');
            }

            if (socket.userId) {
                delete userConnected[socket.userId];
            }
            console.log('connection (dis): ', userConnected);
        });

        require('../services/CommentInfoService').commentInfoSocket(socket, io, (error) => {
            socket.emit('error_msg', { error });
        });

        require('../services/FriendService').friendSocket(socket, io, userConnected);

        //#region new socket
        // on
        // - type: new, join: required.
        // - rID: if type = join.
        // - title: if type = new.
        // - id: required.
        // emit
        // - status: 1 Sucess / 2 Full / 3 Fail.
        // - roomDetail: id, player list, title,
        // - player color: white/black
        socket.on('join-room', async (detail) => {
            try {
                if (detail.type === 'new') {
                    let rID = crypto.randomBytes(2).toString('hex');
                    while (rooms.filter((r) => r.id === rID).length > 0) {
                        rID = crypto.randomBytes(2).toString('hex');
                    }

                    const player = new Array();
                    player.push({ ...userConnected[socket.userId].detail, color: detail.color });
                    const room = {
                        id: rID,
                        title: detail.title,
                        player: player,
                    };

                    rooms.push(room);
                    socket.join(room.id);
                    socket.emit('rep-join-room', {
                        detail: room,
                        status: 1,
                        color: detail.color,
                    });

                    socket.handshake.auth = {
                        ...socket.handshake.auth,
                        detail: room
                    };
                    io.emit('req-get-rooms', rooms);
                } else if (detail.type === 'join') {
                    const room = rooms.filter((r) => r.id === detail.rID)[0];
                    if (room.player.length === 2) {
                        socket.emit('rep-join-room', {
                            detail: null,
                            status: 2,
                            color: null,
                        });
                    } else {
                        const color = 1 - room.player[0].color;
                        room.player.push({ ...userConnected[socket.userId].detail, color: color });
                        rooms[rooms.findIndex((r) => r.id === room.id)] = room;
                        socket.join(room.id);
                        io.to(room.id).emit('rep-join-room', {
                            detail: room,
                            status: 1,
                            color: color,
                        });

                        socket.handshake.auth = {
                            ...socket.handshake.auth,
                            detail: room
                        };

                        io.emit('req-get-rooms', rooms);
                    }
                } else {
                    socket.emit('rep-join-room', {
                        detail: null,
                        status: 3,
                        color: null,
                    });
                }
            } catch (ex) {
                socket.emit('rep-create-room', {
                    detail: null,
                    status: 3,
                    color: null,
                });
            }
        });

        socket.on('get-rooms', async () => {
            socket.emit('rep-get-rooms', rooms);
        });

        // on
        // - roomID
        socket.on('leave-room', async (request) => {
            const room = request.rId;
            io.to(room).emit('req-leave-room', {
                uId: request.uId,
            });
            socket.leave(room.id);
            rooms = rooms.filter((r) => r.id !== room);
        });

        // on
        // - start
        // - target
        // - flag
        // - promo
        socket.on('send-move', async (request) => {
            const { rId, moving, timer } = request;

            io.to(rId).emit('req-send-move', {
                moving: moving,
                timer: timer,
            });
        });

        socket.on('res-draw', async (request) => {
            const { roomID } = request;
            socket.broadcast.to(roomID).emit('res-draw');
        });

        socket.on('req-draw', async (request) => {
            const { isDraw, roomID } = request;
            if (isDraw) {
                io.to(roomID).emit('game-end');
            } else {
                socket.broadcast.to(roomID).emit('req-draw');
            }
        });

        socket.on('reconnect', (detail) => {
            console.log("reconnecting");
            socket.join(detail.id);
            console.log(detail.id);
            socket.broadcast.to(detail.id).emit('reconnect-room');
        });

        socket.on('initializing-detail', (payload) => {
            console.log("send initilzied");
            const pack = {
                detail: payload.detail,
                gameState: payload.gameState,
                history: payload.history
            };
            socket.broadcast.to(payload.detail.id).emit("initializing-detail", pack);
        })

        //#endregion new socket

        //#region old socket
        socket.on(`existingPlayer`, (data) => {
            io.sockets.in(data.roomId).emit(`clientExistingPlayer`, data);
        });

        require('../services/GameService').cameraMove(socket, io);
        require('../services/GameService').disconnect(socket, io);
        require('../services/GameService').leaveRoom(socket, io);
        require('../services/GameService').fetchPlayers(socket, io);
        require('../services/GameService').joinRoom(socket, io);
        require('../services/GameService').makeMove(socket, io);
        require('../services/GameService').resetGame(socket, io);
        require('../services/GameService').sendMessage(socket, io);
        require('../services/GameService').promotePawn(socket, io);
        //#endregion old socket
    });
};

module.exports = rootSocket;
