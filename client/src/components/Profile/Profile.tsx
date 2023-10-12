import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { RootState } from 'src/app/store';
import { Friend, Profile as ProfileStyle } from 'src/redux/reducer/profile/Types';
import { profileActions } from 'src/redux/reducer/profile/profile';
import CommentInfoList from 'src/share/comment/CommentInfoList';
import Header, { socket } from 'src/share/header/Header';

import '../profile/Profile.scss';
import { toast } from 'react-toastify';
import MessageService from 'src/services/message/MessageService';
import { serverTimestamp } from 'firebase/firestore';

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = (props: ProfileProps) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const profile = useAppSelector((state: RootState) => state.profileReducer.profile);
    const isLoading = useAppSelector((state: RootState) => state.profileReducer.isLoading);
    const dispatch = useAppDispatch();
    const [option, setOption] = useState<string>('history');
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isFriend, setisFriend] = useState<number>(3);
    enum friendStatus {
        'Chấp nhận' = 0,
        'Đã gửi lời mời' = 1,
        'Bạn bè' = 2,
        'Kết bạn' = 3,
    }
    const nav = useNavigate();
    const { username } = useParams();

    useEffect(() => {
        dispatch(profileActions.reqGetProfile({ username }));
    }, [username]);

    useEffect(() => {
        if (profile.friends) {
            const listFriends: Friend[] = profile.friends.filter((f: any) => f.status === 2);
            setFriends(listFriends);

            profile.friends.forEach((f: Friend) => {
                if (currentUser._id === f.recipient._id) setisFriend(f.status);
            });
        }
    }, [profile]);

    useEffect(() => {
        if (option === 'history') {
            console.log('history');
        }
        if (option === 'comment') {
            dispatch(profileActions.reqGetCommentInfoesUser({ username: profile._id, params: {} }));
        }
    }, [option, profile]);

    useEffect(() => {
        socket.on('updated-friend', (friend: Friend) => {
            setFriends((prev) => [...prev, friend]);
        });

        return () => {
            socket.removeAllListeners();
        };
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;

    }

    const requestHandle = () => {
        console.log(profile._id);
        if (isFriend === 3) {
            socket.emit('addFriend', currentUser._id, profile._id, (succcess: boolean) => {
                if (succcess) {
                    setisFriend(1);
                    toast.success(`Đã gửi lời mời kết bạn tới ${profile.username}`);
                } else {
                    toast.error('Đã có lỗi xảy ra');
                }
            });
        }
    };

    const chatHandle = async () => {
        let combineId = '';
        if (profile._id) {
            if (currentUser._id > profile._id) combineId = profile._id + currentUser._id;
            else combineId = currentUser._id + profile._id;
        }

        console.log(combineId);

        const doc = await MessageService.get('chat', combineId);
        console.log(doc);
        if (doc?.exists()) {
            nav(`/messages/${combineId}`);
        } else {
            const _data = {
                lastMessage: '',
                members: [currentUser._id, profile._id],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            try {
                const isSuc = await MessageService.addWithId('chat', combineId, _data);
                console.log(isSuc);
                if (isSuc) {
                    const _chat = {
                        [combineId]: {
                            sent: false,
                        },
                    };

                    await MessageService.addWithId('userCharts', currentUser._id, _chat);
                    nav(`/messages/${combineId}`)
                }
            } catch (error) {
                toast.error('Đã có lỗi xảy ra');
            }
        }
    };

    return (
        <>
            <Header />
            <div className="profile-container">
                <div className="avatar-container">
                    <div className="avatar-img ">
                        <img src={profile?.avatar} alt={profile?.username} />
                    </div>
                    <div className="avatar-content">
                        <div className="avatar-username">
                            {profile?.username} - {profile?.elo || 0}
                        </div>
                        {profile._id !== currentUser._id && (
                            <div className="profile-feature">
                                <div className="btn-form btn-form-save" onClick={requestHandle}>
                                    {friendStatus[isFriend]}
                                </div>
                                <div className="btn-form btn-form-save" onClick={chatHandle}>
                                    Nhắn tin
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="toEdit w-10">
                        {currentUser.username === profile?.username && (
                            <Link to={`/profile/${username}/edit`}>Chỉnh sửa</Link>
                        )}
                    </div>
                </div>
                <div className="infomation-container">
                    <div className="information-title">Bạn bè</div>
                    <div className="information-content friend-list">
                        {friends.map((f: Friend) => {
                            return (
                                <div
                                    key={f.recipient._id}
                                    className="friend-item"
                                    onClick={(evt) => {
                                        nav(`/profile/${f.recipient.username}`);
                                    }}
                                >
                                    <img src={f.recipient.avatar} alt={f.recipient.username} />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <br></br>
                <div>
                    <div className="notes-toggle-button">
                        <button
                            className={
                                (option === 'history' && 'notes-button-active ') +
                                ' notes-button w-50 notes-match-button'
                            }
                            onClick={(evt) => setOption('history')}
                        >
                            Lịch sử đấu
                        </button>
                        <button
                            className={
                                (option === 'comment' && 'notes-button-active ') +
                                ' notes-button w-50 notes-comment-button'
                            }
                            onClick={(evt) => setOption('comment')}
                        >
                            Nhận xet
                        </button>
                    </div>
                    {option === 'history' && <div>div</div>}
                    {option === 'comment' && <CommentInfoList />}
                </div>
            </div>
        </>
    );
};

export default Profile;
