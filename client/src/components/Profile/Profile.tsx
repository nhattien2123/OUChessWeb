import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './Profile.scss';
import { current } from '@reduxjs/toolkit';

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = (props: ProfileProps) => {
    const {username} = useParams();
    return (
        <>
            <div className="profile-container">
                <div className="avatar-container">
                    <div className="avatar-img ">
                        <img src="" alt="Avatar" />
                        <div className="input-file">
                            <input type="file" name="avatar" id="avatar" />
                            <label className="label-avatar" htmlFor="avatar">
                                Tải ảnh lên
                            </label>
                        </div>
                    </div>
                    <div className="avatar-content">
                        <div className="avatar-username">username</div>
                        <div className="avatar-detail">
                            <div>1</div>
                            <div>1</div>
                            <div>1</div>
                            <div>1</div>
                        </div>
                    </div>
                    <div className="toEdit w-10">
                        <Link to={`/profile/${username}/edit`}>Chỉnh sửa</Link>
                    </div>
                </div>
                <div className="infomation-container">
                    <div className="information-title">Bạn bè</div>
                    <div className="information-content friend-list">
                        <div className="friend-item">Bạn bè 1</div>
                        <div className="friend-item">Bạn bè 2</div>
                        <div className="friend-item">Bạn bè 3</div>
                        <div className="friend-item">Bạn bè 4</div>
                    </div>
                </div>
                <br></br>
                <div>
                    <div className='notes-toggle-button'>
                        <button className='notes-button w-50 notes-match-button notes-button-active'>Lịch sử đấu</button>
                        <button className='notes-button w-50 notes-comment-button'>Nhận xet</button>
                    </div>
                    <div>
                        <div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
