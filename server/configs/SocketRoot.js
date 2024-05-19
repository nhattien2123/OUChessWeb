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
            next();
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
        // console.log('connection - (con): ', userConnected);
        // console.log('rooms: ', rooms);

        socket.on('disconnect', () => {
            userCount -= 1;
            if (socket.userId) {
                delete userConnected[socket.userId];
            }
            console.log('connection (dis): ', userConnected);
        });

        socket.on('reconnect', () => { });
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
                    player.push(userConnected[socket.userId].detail);
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
                        color: 0,
                    });

                    io.expert(rooms).emit('req-get-rooms', rooms);
                } else if (detail.type === 'join') {
                    const room = rooms.filter((r) => r.id === detail.rID)[0];
                    if (room.player.length === 2) {
                        socket.emit('rep-join-room', {
                            detail: null,
                            status: 2,
                            color: null,
                        });
                    } else {
                        room.player.push(userConnected[socket.userId].detail);
                        rooms[rooms.findIndex((r) => r.id === room.id)] = room;
                        socket.join(room.id);
                        io.to(room.id).emit('rep-join-room', {
                            detail: room,
                            status: 1,
                            color: 1,
                        });

                        io.expert(rooms).emit('req-get-rooms', rooms);
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
                uId: request.uId
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

        //#endregion new socket

        //#region old socket
        socket.on(`existingPlayer`, (data) => {
            io.sockets.in(data.roomId).emit(`clientExistingPlayer`, data);
        });

        var currentPlayer = {};
        currentPlayer.name = 'unknown';


        socket.on('player connect', function () {
            console.log(currentPlayer.name + ' recv: player connect, and clients.length is ' + clients.length);
            console.log("Now cliants info : ", clients);
            for (var i = 0; i < clients.length; i++) {
                console.log('clients[', i, '] info : ', clients[i]);
                var playerConnected = {
                    name: clients[i].name,
                    playerPosition: clients[i].playerPosition,
                    playerRotation: clients[i].playerRotation
                };

                var connectedHead = {
                    name: clients[i].name,
                    headPosition: clients[i].headPosition,
                    headRotation: clients[i].headRotation
                };

                var connectedRightHand = {
                    name: clients[i].name,
                    rightHandPosition: clients[i].rightHandPosition,
                    rightHandRotation: clients[i].rightHandRotation
                };

                var connectedLeftHand = {
                    name: clients[i].name,
                    leftHandPosition: clients[i].leftHandPosition,
                    leftHandRotation: clients[i].leftHandRotation
                };

                var othersWakizashi = {
                    name: clients[i].name,
                    wakizashiPosition: clients[i].wakizashiPosition,
                    wakizashiRotation: clients[i].wakizashiRotation
                };

                console.log("Player Connected: " + clients[i].name);
                console.log("Connected Left Hand: " + connectedLeftHand.name);
                socket.emit('other player connected', playerConnected);
                socket.emit('other player head', connectedHead);
                socket.emit('other player right hand', connectedRightHand);
                socket.emit('other player left hand', connectedLeftHand);
                // for (var i = 0; i < enemySpawnPoints.length; i++) {
                //     console.log('enemySpawnPoints[', i, '] info : ', enemySpawnPoints[i]);
                //     var othersEnemy = {
                //         name: enemySpawnPoints[i].name,
                //         enemyPosition: enemySpawnPoints[i].enemyPosition,
                //         enemyRotation: enemySpawnPoints[i].enemyRotation,
                //         health: enemySpawnPoints[i].health
                //     };
                //     socket.emit('others enemy', othersEnemy);
                //     console.log(currentPlayer.name + ' emit: others enemy: ' + JSON.stringify(othersEnemy));
                // }

                // socket.emit('others wakizashi', othersWakizashi);

                console.log(currentPlayer.name + ' emit: other player connected: ' + JSON.stringify(playerConnected));
                console.log(currentPlayer.name + ' emit: other player head: ' + JSON.stringify(connectedHead));
                console.log(currentPlayer.name + ' emit: other player right hand: ' + JSON.stringify(connectedRightHand));
                console.log(currentPlayer.name + ' emit: other player leftt hand: ' + JSON.stringify(connectedLeftHand));
                console.log(currentPlayer.name + ' emit: other wakizashi : ' + JSON.stringify(othersWakizashi));
            }
        });

        socket.on('play', function (data) {
            console.log(currentPlayer.name + ' recv: play: ' + JSON.stringify(data));
            console.log("old player info : ", currentPlayer);
            console.log("data is : ", data);
            currentPlayer = data;
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

            clients.push(currentPlayer);
            console.log(currentPlayer.name + ' emit: play: ' + JSON.stringify(currentPlayer));
            socket.emit('play', currentPlayer);
            socket.broadcast.emit('other player connected', currentPlayer);
        });

        socket.on('enemy', function (enemyData) {
            enemyData.enemySpawnPoints.forEach(function (_enemySpawnPoint) {
                var enemySpawnPoint = {
                    name: (currentPlayer.name + ' s ememy : ' + guid()),
                    enemyPosition: _enemySpawnPoint.enemyPosition,
                    enemyRotation: _enemySpawnPoint.enemyRotation,
                    health: 100
                };
                enemySpawnPoints.push(enemySpawnPoint);
                socket.emit('enemy', enemySpawnPoint);
                console.log('enemySpawnPoint : ', enemySpawnPoint);
            });
            console.log('enemySpawnPoints info : ', enemySpawnPoints);
        });

        socket.on('wakizashi', function (wakizashiData) {
            wakizashiSpawnPoints = [];
            wakizashiData.wakizashiSpawnPoints.forEach(function (_wakizashiSpawnPoint) {
                var wakizashiSpawnPoint = {
                    name: guid(),
                    wakizashiPosition: _wakizashiSpawnPoint.wakizashiPosition,
                    wakizashiRotation: _wakizashiSpawnPoint.wakizashiRotation,
                    health: 100
                };
                wakizashiSpawnPoints.push(wakizashiSpawnPoint);
            });
            console.log(currentPlayer.name + ' wakizashi genarated');
        });

        socket.on('head move', function (data) {
            console.log(currentPlayer.name + ' recv: head move: ' + JSON.stringify(data));
            currentPlayer.headPosition = data.headPosition;
            socket.broadcast.emit('head move', currentPlayer);
        });

        socket.on('head turn', function (data) {
            console.log(currentPlayer.name + ' recv: head turn: ' + JSON.stringify(data));
            currentPlayer.headRotation = data.headRotation;
            socket.broadcast.emit('head turn', currentPlayer);
        });


        socket.on('player move', function (data) {
            console.log(currentPlayer.name + ' recv: move: ' + JSON.stringify(data));
            currentPlayer.playerPosition = data.playerPosition;
            socket.broadcast.emit('player move', currentPlayer);
        });

        socket.on('player turn', function (data) {
            console.log(currentPlayer.name + ' recv: turn: ' + JSON.stringify(data));
            currentPlayer.playerRotation = data.playerRotation;
            socket.broadcast.emit('player turn', currentPlayer);
        });

        socket.on('right hand move', function (data) {
            console.log(currentPlayer.name + ' recv: right hand move: ' + JSON.stringify(data));
            currentPlayer.rightHandPosition = data.rightHandPosition;
            socket.broadcast.emit('right hand move', currentPlayer);
        });

        socket.on('right hand turn', function (data) {
            console.log(currentPlayer.name + ' recv: right hand turn: ' + JSON.stringify(data));
            currentPlayer.rightHandRotation = data.rightHandRotation;
            socket.broadcast.emit('right hand turn', currentPlayer);
        });

        socket.on('left hand move', function (data) {
            console.log(currentPlayer.name + ' recv: left hand move: ' + JSON.stringify(data));
            currentPlayer.leftHandPosition = data.leftHandPosition;
            socket.broadcast.emit('left hand move', currentPlayer);
        });

        socket.on('left hand turn', function (data) {
            console.log(currentPlayer.name + ' recv: left hand turn: ' + JSON.stringify(data));
            currentPlayer.leftHandRotation = data.leftHandRotation;
            socket.broadcast.emit('left hand turn', currentPlayer);
        });

        socket.on('enemy move', function (data) {
            console.log(currentPlayer.name + ' recv: enemy move: ' + JSON.stringify(data));
            currentPlayer.enemyPosition = data.enemyPosition;
            socket.broadcast.emit('enemy move', currentPlayer);
        });

        socket.on('enemy turn', function (data) {
            console.log(currentPlayer.name + ' recv: enemy turn: ' + JSON.stringify(data));
            currentPlayer.enemyRotation = data.enemyRotation;
            socket.broadcast.emit('enemy turn', currentPlayer);
        });

        socket.on('wakizashi move', function (data) {
            console.log(currentPlayer.name + ' recv: wakizashi move: ' + JSON.stringify(data));
            currentPlayer.wakizashiPosition = data.wakizashiPosition;
            socket.broadcast.emit('wakizashi move', currentPlayer);
        });

        socket.on('wakizashi turn', function (data) {
            console.log(currentPlayer.name + ' recv: wakizashi turn: ' + JSON.stringify(data));
            currentPlayer.wakizashiRotation = data.wakizashiRotation;
            socket.broadcast.emit('wakizashi turn', currentPlayer);
        });

        socket.on('disconnect', function () {
            console.log(currentPlayer.name + ' recv: disconnect ' + currentPlayer.name);
            socket.broadcast.emit('other player disconnected', currentPlayer);
            console.log(currentPlayer.name + ' bcst: other player disconnected ' + JSON.stringify(currentPlayer));
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].name === currentPlayer.name) {
                    clients.splice(i, 1);
                }
            }
        });

        socket.on('health', function (data) {
            console.log(currentPlayer.name + ' bcst: health: ' + JSON.stringify(data));
            if (data.from === currentPlayer.name) {
                var indexDamaged = 0;
                if (!data.isEnemy) {
                    clients = clients.map(function (client, index) {
                        if (client.name === data.name) {
                            indexDamaged = index;
                            client.health -= data.healthChange;
                        }
                        return client;
                    });
                } else {
                    enemies = enemies.map(function (enemy, index) {
                        if (enemy.name === data.name) {
                            indexDamaged = index;
                            enemy.health -= data.healthChange;
                        }
                        return enemy;
                    });
                }

                var responce = {
                    name: (!data.isEnemy) ? clients[indexDamaged].name : enemies[indexDamaged].name,
                    health: (!data.isEnemy) ? clients[indexDamaged].health : enemies[indexDamaged].health
                };
                console.log(currentPlayer.name + ' bcst: health: ' + JSON.stringify(responce));
                socket.emit('health', response);
                socket.broadcast.emit('health', response);
            }

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
