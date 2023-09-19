const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const db = require("./configs/MongoDB")

const app = express();
const PORT = process.env.PORT || 8082

app.use(cors({}));
app.use(cookieParser());
app.use(express.json());

//Database: MongoDB
db.connectoDb();

//Routers
app.use(require("./routers"));

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`)
});