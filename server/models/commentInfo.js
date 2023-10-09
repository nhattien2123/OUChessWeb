const mongoose = require("mongoose");

const commentInfoSchema = new mongoose.Schema({
    content: {
        type: String
    },
    userId: {
        type:String,
        ref: "user"
    },
}, {timestamps: true});

module.exports = mongoose.model("commentInfo", commentInfoSchema);