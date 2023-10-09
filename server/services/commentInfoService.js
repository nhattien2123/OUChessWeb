const commentInfo = require('../models/commentInfo');
const commentInfoRepository = require('../repositories/commentInfoRepository');

const commentInfoService = {
    addComment: async (comment) => {
        const newComment = await commentInfo(comment);
        return await commentInfoRepository.addComment(newComment);
    },
};

const commentInfoSocket = (socket, io) => {
    socket.on('newComment', async (comment) => {
        io.emit('newComment', comment);
    });
};

module.exports = {commentInfoService, commentInfoSocket};
