import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';

import '../login/Login.scss';
import { authActions } from '../../redux/reducer/auth/authReducer';
import Cookies from 'js-cookie';

interface LoginProps {}

const Login = () => {
    const isLoggIn = useAppSelector((state: RootState) => state.authReducer.isLoggedIn);
    const token = useAppSelector((state: RootState) => state.authReducer.token);
    const errorMsg = useAppSelector((state:RootState) => state.commonReducer.errorMsg);
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const loginHandler = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        dispatch(authActions.reqGetDataLogin({ username, password }));
    };

    useEffect(() => {
        if (isLoggIn) {
            Cookies.set('token', token, {
                path: '/',
            });
            nav('/');
        }
    }, [isLoggIn, token]);

    return (
        <>
            <div className="container">
                <div className="main">
                    <div className="login-title">ĐĂNG NHẬP</div>
                    <div className="login-container">
                        {errorMsg !== "" && <div className='error-block'>{errorMsg}</div>}
                        <form className="login-input" onSubmit={loginHandler}>
                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="text"
                                    placeholder="Tên đăng nhập"
                                    value={username}
                                    onChange={(evt) => setUsername(evt.target.value.trim())}
                                ></input>
                            </div>
                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="password"
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChange={(evt) => setPassword(evt.target.value.trim())}
                                ></input>
                            </div>

                            <div className="btn-container">
                                <button type="submit" className="btn-style">
                                    Đăng nhập
                                </button>
                            </div>
                        </form>
                        <div className="register-link">
                            <Link to={'/register'} className="register-dir">
                                {' '}
                                Đăng ký
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
