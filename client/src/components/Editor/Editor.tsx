import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import moment from 'moment';
import { userActions } from '../../redux/reducer/user/userReducer';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import Sidebar from '../../share/sidebar/Sidebar';
import './Editor.scss';
import ProfileForm from 'src/share/form/ProfileForm';
import ChangePasswordForm from 'src/share/form/ChangePasswordForm';

interface EditorProps {}

const Editor: React.FC<EditorProps> = () => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const isLoading = useAppSelector((state: RootState) => state.userReducer.isLoading);
    const errorMsg = useAppSelector((state: RootState) => state.commonReducer.errorMsg);
    const dispatch = useAppDispatch();
    const param = useParams();
    const nav = useNavigate();

    const [selectedImage, setSelectedImage] = useState('');
    const [profile, setProfile] = useState(currentUser);
    const [psw, setPsw] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const usernameProfile = param['username'];
        if (currentUser.username !== usernameProfile) {
            nav(`/profile/${usernameProfile}`);
        }
    }, []);

    useEffect(() => {
        setProfile(currentUser);
        Cookies.set('user', JSON.stringify(currentUser));
    }, [currentUser]);

    const updateProfile = (data: any) => {
        dispatch(userActions.reqPatchUpdateUser({ changedUser: data }));
    };

    const updatePassword = (data: any) => {
        const { password } = data;

        const d = {
            username: profile.username,
            password: password,
        };
        dispatch(userActions.reqPatchChangPassword({ changedPassword: d }));
    };

    const updateImage = (e: any) => {
        const f = e.target.files[0];
        const formData = new FormData();
        formData.append('file', f);
        const data = {
            username: profile.username,
            form: formData,
        };
        dispatch(
            userActions.reqPatchChangeAvatar({
                changedAvatar: data,
            }),
        );
    };

    return (
        <>
            <div className="profile-container">
                <div className="avatar-container">
                    <div className="avatar-img">
                        <img src={profile.avatar} alt="Avatar" className='profile-avatar' />
                        <div className="input-file">
                            <input onChange={updateImage} type="file" name="avatar" id="avatar" />
                            <label className="label-avatar" htmlFor="avatar">
                                Tải ảnh lên
                            </label>
                        </div>
                    </div>
                    <div className="avatar-content">
                        <div className="avatar-username">{profile.username}</div>
                    </div>
                </div>
                
                        <ProfileForm profile={profile} isLoading={isLoading} onSubmit={updateProfile} />
                    
                {/* <div className="information-container">
                    <div className="information-title">ĐẶT LẠI MẬT KHẨU</div>
                    <div className="information-content">
                        <form onSubmit={updatePassword} className="information-form">
                            <div className="input-form-container">
                                <label className="label-form" htmlFor="newPassword">
                                    Mật khẩu
                                </label>
                                <input
                                    value={psw.newPassword}
                                    type="password"
                                    id="newPassword"
                                    className="input-form"
                                    onChange={(evt) => setPsw({ ...psw, newPassword: evt.target.value })}
                                />
                            </div>
                            <div className="input-form-container">
                                <label className="label-form" htmlFor="confirmPassword">
                                    Xác nhận mật khẩu
                                </label>
                                <input
                                    value={psw.confirmPassword}
                                    type="password"
                                    id="confirmPassword"
                                    className="input-form"
                                    onChange={(evt) => setPsw({ ...psw, confirmPassword: evt.target.value })}
                                />
                            </div>
                            <div className="input-form-container">
                                <button className="btn-form btn-form-save" type="submit">
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div> */}
                <ChangePasswordForm onSubmit={updatePassword} />
            </div>
        </>
    );
};

export default Editor;
