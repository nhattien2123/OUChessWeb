const crypto = require('crypto');

var clients = [];
const rootSocket = (io) => {
    let userConnected = [];
    let rooms = new Array();
    const jwt = require('jsonwebtoken');
    let userCount = 0;

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (socket.handshake.query.token === "UNITY") {
            // next();
        }
        else if (token) {
            jwt.verify(token, process.env.JWT_SECRETKEY, (err, user) => {
                if (err) {
                    return;
                } else {
                    socket.token = token;
                    socket.userId = user._id;
                    userConnected[user._id] = {
                        detail: { ...socket.handshake.auth.userInfo },
                        socket: socket.id,
                        type: socket.handshake.auth.type
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
        console.log("user: ", userConnected);
        console.log("room: ", rooms);

        socket.on('disconnect', () => {
            userCount -= 1;
            if (socket.handshake.auth.detail) {
                socket.broadcast.to(socket.handshake.auth.detail.id).emit('opponent-disconnect');
            }

            if (socket.userId) {
                delete userConnected[socket.userId];
            }
            console.log('connection (dis): ', userConnected);

            console.log(currentPlayer.name + ' recv: disconnect ' + currentPlayer.name);
            socket.broadcast.emit('other player disconnected', JSON.stringify(currentPlayer));
            // console.log(currentPlayer.name + ' bcst: other player disconnected ' + JSON.stringify(currentPlayer));
            for (var i = 0; i < clients.length; i++) {
                var client = JSON.parse(clients[i]);
                if (client.name === currentPlayer.name) {
                    console.log("test");
                    clients.splice(i, 1);
                }
            }
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
            // console.log(rooms);
            if (socket.handshake.query.token === "UNITY") {
            }
            console.log("Success")
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
            const { rId, moving } = request;

            io.to(rId).emit('req-send-move', {
                moving: moving,
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

        socket.on('request-continue-game', (roomID) => {
            io.to(roomID).emit("respone-continue-game");
        })

        //#endregion new socket

        //#region old socket
        socket.on('existingPlayer', (data) => {
            io.sockets.in(data.roomId).emit('clientExistingPlayer', data);
        });

        var currentPlayer = {};
        currentPlayer.name = 'unknown';
        currentIndex = 0;

        socket.on('player connect', () => {
            console.log(currentPlayer.name + ' recv: player connect, and clients.length is ' + clients.length);
            console.log("Now clients info : ", clients);
            for (var i = 0; i < clients.length; i++) {
                var client = JSON.parse(clients[i]);
                console.log('clients[', i, '] info : ', clients[i]);
                var playerConnected = {
                    name: client.name,
                    playerPosition: client.playerPosition,
                    playerRotation: client.playerRotation
                };

                var connectedHead = {
                    name: client.name,
                    headPosition: client.headPosition,
                    headRotation: client.headRotation
                };

                var connectedRightHand = {
                    name: client.name,
                    rightHandPosition: client.rightHandPosition,
                    rightHandRotation: client.rightHandRotation
                };

                var connectedLeftHand = {
                    name: client.name,
                    leftHandPosition: client.leftHandPosition,
                    leftHandRotation: client.leftHandRotation
                };

                console.log("Player Connected: " + client.name);
                console.log("Connected Left Hand: " + connectedLeftHand.name);
                socket.emit('other player connected', JSON.stringify(playerConnected));
                socket.emit('other player head', JSON.stringify(connectedHead));
                socket.emit('other player right hand', JSON.stringify(connectedRightHand));
                socket.emit('other player left hand', JSON.stringify(connectedLeftHand));

                console.log(currentPlayer.name + ' emit: other player connected: ' + JSON.stringify(playerConnected));
                console.log(currentPlayer.name + ' emit: other player head: ' + JSON.stringify(connectedHead));
                console.log(currentPlayer.name + ' emit: other player right hand: ' + JSON.stringify(connectedRightHand));
                console.log(currentPlayer.name + ' emit: other player leftt hand: ' + JSON.stringify(connectedLeftHand));
            }
        });

        socket.on('play', (data) => {
            currentPlayer = JSON.parse(data);
            console.log(currentPlayer.name + ' recv: play: ' + JSON.stringify(data));
            console.log("old player info : ", currentPlayer);
            console.log("data is : ", currentPlayer);
            console.log("Data name is: " + currentPlayer.name);
            currentPlayer.name = "desktop" + clients.length;
            console.log("new player info : ", currentPlayer);
            if (clients.length === 0) {
                var playerPosition = {
                    playerPosition: data.playerPosition
                }

                var playerRotation = {
                    playerRotation: data.playerRotation
                }
            }
            clients.push(JSON.stringify(currentPlayer));
            console.log(currentPlayer.name + ' emit: play: ' + JSON.stringify(currentPlayer));
            socket.emit('play', JSON.stringify(currentPlayer));
            socket.broadcast.emit('other player connected', JSON.stringify(currentPlayer));
        });

        socket.on('head move', (data) => {
            // console.log(currentPlayer.name + ' recv: head move: ' + JSON.stringify(data));
            currentPlayer.headPosition = JSON.parse(data).headPosition;
            // console.log(JSON.stringify(data));
            // console.log(currentPlayer.headPosition);
            socket.broadcast.emit('head move', JSON.stringify(currentPlayer));
        });

        socket.on('head turn', (data) => {
            // console.log(currentPlayer.name + ' recv: head turn: ' + JSON.stringify(data));
            currentPlayer.headRotation = JSON.parse(data).headRotation;
            socket.broadcast.emit('head turn', JSON.stringify(currentPlayer));
        });


        socket.on('player move', (data) => {
            // console.log(currentPlayer.name + ' recv: move: ' + JSON.stringify(data));
            currentPlayer.playerPosition = JSON.parse(data).playerPosition;
            socket.broadcast.emit('player move', JSON.stringify(currentPlayer));
        });

        socket.on('player turn', (data) => {
            // console.log(currentPlayer.name + ' recv: turn: ' + JSON.stringify(data));
            currentPlayer.playerRotation = JSON.parse(data).playerRotation;
            socket.broadcast.emit('player turn', JSON.stringify(currentPlayer));
        });

        socket.on('right hand move', (data) => {
            // console.log(currentPlayer.name + ' recv: right hand move: ' + JSON.stringify(data));
            currentPlayer.rightHandPosition = JSON.parse(data).rightHandPosition;
            socket.broadcast.emit('right hand move', JSON.stringify(currentPlayer));
        });

        socket.on('right hand turn', (data) => {
            // console.log(currentPlayer.name + ' recv: right hand turn: ' + JSON.stringify(data));
            currentPlayer.rightHandRotation = JSON.parse(data).rightHandRotation;
            socket.broadcast.emit('right hand turn', JSON.stringify(currentPlayer));
        });

        socket.on('left hand move', (data) => {
            // console.log(currentPlayer.name + ' recv: left hand move: ' + JSON.stringify(data));
            currentPlayer.leftHandPosition = JSON.parse(data).leftHandPosition;
            socket.broadcast.emit('left hand move', JSON.stringify(currentPlayer));
        });

        socket.on('left hand turn', (data) => {
            // console.log(currentPlayer.name + ' recv: left hand turn: ' + JSON.stringify(data));
            currentPlayer.leftHandRotation = JSON.parse(data).leftHandRotation;
            socket.broadcast.emit('left hand turn', JSON.stringify(currentPlayer));
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
