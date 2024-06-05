const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const { createServer } = require('http');
const { Server, Socket } = require('socket.io');
const db = require('./configs/MongoDB');
const upload = require('./configs/MulterConfig');

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 8082;

app.use(cors({}));
app.use(cookieParser());
app.use(express.json());
app.use(upload.single('file'));

//Database: MongoDB
db.connectoDb();
const friend = require('./models/Friend');
//Routers
app.use(require('./routers'));

//Socket
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
    },
    pingInterval: 10000,
    pingTimeout: 5000,
});

const { rootSocket } = require('./configs/SocketRoot');
rootSocket(io);

httpServer.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`);
});
