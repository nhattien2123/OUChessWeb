import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import moment from 'moment';
import { userActions } from '../../redux/reducer/user/userReducer';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import Sidebar from '../../share/sidebar/Sidebar';
import "../Editor/Editor.scss";

interface EditorProps {}

const Editor: React.FC<EditorProps> = () => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    // const password = useAppSelector((state: RootState) => state.userReducer.password);
    const isLoading = useAppSelector((state: RootState) => state.userReducer.isLoading);
    const dispatch = useAppDispatch();
    const param = useParams();
    const nav = useNavigate();

    const [selectedImage, setSelectedImage] = useState(
        ""
    );
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

    const changeProfileField = (evt: any, field: string) => {
        setProfile((current) => {
            return { ...current, [field]: evt.target.value };
        });
    };

    const updateProfile = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        dispatch(userActions.reqPatchUpdateUser({ changedUser: profile }));
    };

    const updatePassword = (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (psw.newPassword === psw.confirmPassword) {
            const data = {
                username: profile.username,
                password: psw.newPassword,
            };
            dispatch(userActions.reqPatchChangPassword({ changedPassword: data }));
            console.log(psw);
        }
        // dispatch(userActions.reqPatchChangPassword({newPassword: }))
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
            <Sidebar />
            <div className="profile-container">
                <div className="avatar-container">
                    <div className="avatar-img">
                        <img src={profile.avatar} alt="Avatar" />
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
                <div className="information-container">
                    <div className="information-title">THÔNG TIN NGƯỜI DÙNG</div>
                    <div className="information-content">
                        <form onSubmit={updateProfile} className="information-form">
                            <div className="input-form-container">
                                <label className="label-form" htmlFor="firstName">
                                    Họ và tên đệm
                                </label>
                                <input
                                    value={profile.firstName}
                                    type="text"
                                    id="firstName"
                                    className="input-form"
                                    onChange={(evt) => changeProfileField(evt, 'firstName')}
                                />
                            </div>
                            <div className="input-form-container">
                                <label className="label-form" htmlFor="lastName">
                                    Tên
                                </label>
                                <input
                                    value={profile.lastName}
                                    type="text"
                                    id="lastName"
                                    className="input-form"
                                    onChange={(evt) => changeProfileField(evt, 'lastName')}
                                />
                            </div>
                            <div className="input-form-container">
                                <label className="label-form" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    value={profile.email}
                                    type="text"
                                    id="email"
                                    className="input-form"
                                    onChange={(evt) => changeProfileField(evt, 'email')}
                                />
                            </div>
                            <div className="input-form-container">
                                <label className="label-form" htmlFor="phone">
                                    Phone
                                </label>
                                <input
                                    value={profile.phone}
                                    type="text"
                                    id="phone"
                                    className="input-form"
                                    onChange={(evt) => changeProfileField(evt, 'phone')}
                                />
                            </div>

                            <div className="input-form-container">
                                <label className="label-form" htmlFor="dOb">
                                    Ngày sinh
                                </label>
                                <input
                                    value={moment(profile.dateOfBirth).add(7, 'hours').format('yyyy-MM-DD')}
                                    type="date"
                                    id="dOb"
                                    className="input-form"
                                    onChange={(evt) => changeProfileField(evt, 'dateOfBirth')}
                                />
                            </div>
                            <div className="input-form-container">
                                <label className="label-form" htmlFor="nation">
                                    Quốc tịch
                                </label>
                                <input value={profile.nation} type="text" id="nation" className="input-form" />
                            </div>

                            <div className="input-form-container">
                                {!isLoading ? (
                                    <button className="btn-form btn-form-save" type="submit">
                                        Lưu
                                    </button>
                                ) : (
                                    <button className="btn-form btn-form-save" type="submit">
                                        ...
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="information-container">
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
                </div>
            </div>
        </>
    );
};

export default Editor;
