import React, { useState } from 'react';
import '../sidebar/Sidebar.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { RootState } from 'src/app/store';
import Cookies from 'js-cookie';
import { authActions } from 'src/redux/reducer/auth/authReducer';
import { userActions } from 'src/redux/reducer/user/userReducer';
import { socket } from 'src/index';
interface Props {}

const Sidebar = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const [kw, setKw] = useState<string>('');
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    const logOut = () => {
        Cookies.remove('user');
        Cookies.remove('token');
        socket.auth = {
            token: '',
        };
        socket.disconnect();
        socket.connect();
        dispatch(authActions.reqLogOut({}));
        dispatch(userActions.clearUser({}));
    };

    return (
        <>
            <ul className="sidebar">
                <li className="sidebar-item">
                    <Link to={'/'}>Chess Realm</Link>
                </li>
                <li className="sidebar-item">
                    <Link to={'/play/online'}>Play</Link>
                </li>
                <li className="sidebar-item">
                    <Link to={`/profile/${currentUser.username}`}>Thông tin</Link>
                </li>
                <li className="sidebar-item">
                    <Link to={'/messages'}>Tin nhắn</Link>
                </li>
                {currentUser.role === 'ADMIN' && (
                    <li className="sidebar-item">
                        <Link to={'/admin'}>Admin</Link>
                    </li>
                )}
                <li className="sidebar-input">
                    <input
                        placeholder="Tìm kiếm..."
                        onChange={(evt) => setKw(evt.target.value)}
                        onKeyDown={(evt) => {
                            if (evt.key === 'Enter') {
                                if (kw.trim() !== '') {
                                    nav(`/player/?kw=${kw}`);
                                }
                            }
                        }}
                    ></input>
                </li>
                {currentUser._id === '' ? (
                    <>
                        <li className="sidebar-btn">
                            <Link to={`/register`} className="btn-form w-80">
                                Đăng ký
                            </Link>
                        </li>
                        <li className="sidebar-btn">
                            <Link to={`/login`} className="btn-form btn-form-save w-80">
                                Đăng nhập
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="sidebar-btn">
                            <Link to={`/login`} className="btn-form w-80 btn-form-save" onClick={logOut}>
                                Đăng xuất
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </>
    );
};

export default Sidebar;
