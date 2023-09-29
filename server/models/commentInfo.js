const mongoose = require("mongoose");

const commentInfoSchema = new mongoose.Schema({
    content: {
        type: String
    },
    userId: {
        type:String
    },
    parentId: {
        type: String
    },
    
}, {timestamps: true});

module.exports = mongoose.model("commentInfo", commentInfoSchema);