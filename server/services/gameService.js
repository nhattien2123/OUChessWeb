const cameraMove = (socket, io) => {
    socket.on(`cameraMove`, (data) => {
        io.sockets.in(data.roomId).emit(`cameraMoved`, data)
        // console.log(data)
    })
};

const disconnect = (socket, io) => {
    socket.on(`disconnecting`, (data) => {
        console.log(`disconnecting`)
    })
}

const fetchPlayers = (socket, io) => {
    socket.on(`fetchPlayers`, (data) => {
        const players = io.sockets.adapter.rooms.get(data.roomId)?.size || 0
        io.sockets.in(data.roomId).emit(`playersInRoom`, players)
    })
}

const joinRoom = (socket, io) => {
    socket.on(`joinRoom`, (data) => {
        const { roomId, username } = data

        const playerCount = io.sockets.adapter.rooms.get(data.roomId)?.size || 0
        if (playerCount === 2) {
            socket.emit(`newError`, `Room is full`)
            return
        }
        socket.join(roomId)
        const color = playerCount === 1 ? `black` : `white`
        const props = { roomId, username, color, playerCount }
        console.log(props);
        io.sockets.in(roomId).emit(`playerJoined`, props)
    })
}

const makeMove = (socket, io) => {
    socket.on(`makeMove`, (data) => {
        console.log(data)
        io.sockets.in(data.roomId).emit(`moveMade`, data.movingTo)
    })
}

const resetGame = (socket, io) => {
    socket.on(`resetGame`, (data) => {
        io.sockets.in(data.roomId).emit(`gameReset`, true)
    })
}

const sendMessage = (socket, io) => {
    socket.on(`createdMessage`, (data) => {
        const send = data.message
        io.sockets.in(data.roomId).emit(`newIncomingMessage`, send)
    })
}

module.exports = { cameraMove, disconnect, fetchPlayers, joinRoom, makeMove, resetGame, sendMessage };