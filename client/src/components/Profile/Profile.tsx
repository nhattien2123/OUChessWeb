import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { RootState } from 'src/app/store';
import { userState } from 'src/redux/reducer/user/Types';
import { profileActions } from 'src/redux/reducer/profile/profile';
import CommentInfoList from 'src/share/comment/CommentInfoList';

import '../profile/Profile.scss';

interface ProfileProps { }

const Profile: React.FC<ProfileProps> = (props: ProfileProps) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const profile = useAppSelector((state: RootState) => state.profileReducer.profile);
    const isLoading = useAppSelector((state: RootState) => state.profileReducer.isLoading);
    const dispatch = useAppDispatch();
    const [user, setUser] = useState<userState['currentUser']>();
    const [option, setOption] = useState<string>('history');
    const nav = useNavigate();
    const { username } = useParams();

    useEffect(() => {
        // fetch(`${ROOT_URL}/user/${username}/profile`).then((res) =>
        //     res.json().then((json) => {
        //         const info = json.data;
        //         setUser(info);
        //     }),
        // );
        dispatch(profileActions.reqGetProfile({ username }));
    }, [username]);

    useEffect(() => {
        console.log(profile);
    }, [profile]);

    if(isLoading){
        return <div>Loading...</div>
    }

    return (
        <>
            <div className="profile-container">
                <div className="avatar-container">
                    <div className="avatar-img ">
                        <img src={profile?.avatar} alt={profile?.username} />
                    </div>
                    <div className="avatar-content">
                        <div className="avatar-username">
                            {profile?.username} - {profile?.elo || 0}
                        </div>
                        {/* <div className="avatar-detail">
                <div>{user?.elo || 0}</div>
                <div>{user?.}</div>
            </div> */}
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
                        {user &&
                            user.friends.length > 0 &&
                            user?.friends.map((f: any) => {
                                return (
                                    <div
                                        key={f.username}
                                        className="friend-item"
                                        onClick={(evt) => {
                                            nav(`/profile/${f.username}`);
                                        }}
                                    >
                                        <img src={f.avatar} alt={f.username} />
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
                    <div>{option === 'history' ? <div>div</div> : <CommentInfoList />}</div>
                </div>
            </div>
        </>
    );
};

export default Profile;
