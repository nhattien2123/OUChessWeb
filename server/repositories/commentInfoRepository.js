const commentInfo = require('../models/commentInfo');

const commentInfoRepository = {
    getComment: async (params) => {
        try {
            let searchParams = {};
            const username = params.username;
            if(username !== null && username !== ''){
                searchParams.username = username
            }

            commentInfo.find(searchParams, (error, result) => {
                if(error){
                    return null;
                }else{
                    return result;
                }
            })
        } catch (error) {
            return null;
        }
    },
    addComment: async (Comment) => {
        try {
            console.log(Comment)
            const newComment = await Comment.save();
            return newComment;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    updateComment: async (commentId, changed) => {
    },
    deleteComment: async (commentId) => {

    },
};

module.exports = commentInfoRepository;
