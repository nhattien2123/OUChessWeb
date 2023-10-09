import React from 'react';

type Props = {
    comment: {
        content: string,
        userId: {
            _id: string,
            username: string,
            avatar: string
        }
    };
};

const CommentInfoItem = (props: Props) => {
    const { comment } = props;
    return (
        <>
            <div className="comment-info-item">
                <div className="ci-item-avatar">
                    <img
                        src={comment.userId.avatar}
                        alt="avatar"
                    />
                </div>

                <div className="ci-sub">
                    <div className="ci-item-info">{comment.userId.username}</div>
                    <div className="ci-item-content">{comment.content}</div>
                </div>
            </div>
        </>
    );
};

export default CommentInfoItem;
