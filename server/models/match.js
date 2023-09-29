const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    whiteId: {
        type: String
    },
    blackId: {
        type:String
    },
    name: {
        type:String
    },
    winnerPlayer: {
        type:String
    },
    timeMatch: {
        type:String
    }
}, {timestamps: true});

module.exports = mongoose.model("match", matchSchema);