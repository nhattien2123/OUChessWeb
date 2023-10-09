
const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    whiteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    blackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    matchName: {
        type: String
    },
    winnerPlayer: {
        type: String
    },
    mode: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("match", matchSchema);