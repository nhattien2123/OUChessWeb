import React, { FormEvent, useEffect, useState } from 'react';
import CommentInfoItem from './CommentInfoItem';
import io from 'socket.io-client';
import { ROOT_URL } from 'src/config/ApiConstants';
import './Comment.scss';
import Cookies from 'js-cookie';
import { socket } from 'src/index';
import { useAppSelector } from 'src/app/hooks';
import { RootState } from 'src/app/store';


type Props = object;

const CommentInfoList = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const [comment, setComment] = useState<string>('');
    const [comments, setComments] = useState<any[]>([])

    const handlerSubmit = (e: {preventDefault: () => void}) => {
        e.preventDefault();
        if (comment.trim() !== '') {
            socket.emit('newComment', {
                content: comment,
                userId: {
                    _id: currentUser._id,
                    username: currentUser.username,
                    avatar: currentUser.avatar
                }
            });
            setComment('');
        }
    };

    useEffect(() => {
        socket.on('newComment', (comment) => {
            setComments((prev) => [...prev, comment]);
        })

        return () => {
            socket.off("newComment")
        }
    }, [])

    useEffect(() => {
        console.log(comments);
    }, [comments])

    return (
        <>
            {comments.map((m) => {
                return <CommentInfoItem key={m} comment={m} />
            })}
            <form onSubmit={handlerSubmit}>
                <input type="text" value={comment} onChange={evt => setComment(evt.target.value)}/>
                <button type="submit">Gửi</button>
            </form>
        </>
    );
};

export default CommentInfoList;
