const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: [true, "Tài khoản đã tồn tại"]
    },
    password: {
        type: String,
        require: true,
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: Number,
        require: true,
        unique: true
    },
    nation: {
        type: String
    },
    avatar: {
        type: String
    },
    elo: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: "PLAYER"
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }]
}, {timestamps: true});

module.exports = mongoose.model("user", userSchema);