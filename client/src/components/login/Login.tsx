import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { authActions } from '../../redux/reducer/auth/authReducer';
import { userActions } from '../../redux/reducer/user/userReducer';
import '../login/Login.scss';
import LoginForm from 'src/share/form/LoginForm';
import { socket } from 'src/index';
import { toast } from 'react-toastify';
interface LoginProps {}

const Login = () => {
    const isLoggIn = useAppSelector((state: RootState) => state.authReducer.isLoggedIn);
    const token = useAppSelector((state: RootState) => state.authReducer.token);
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const defaultData = {
        username: '',
        password: '',
    };

    const loginHandler = (data: { username: string; password: string }) => {
        dispatch(authActions.reqGetDataLogin(data));
    };

    useEffect(() => {
        if (isLoggIn) {
            Cookies.set('token', token, {
                path: '/',
            });
            socket.auth = {
                token: token,
            };
            socket.disconnect();
            socket.connect();
            dispatch(userActions.reqGetCurrentUser({}));
            toast.success("Đăng nhập thành công");
            nav('/');
        }
    }, [isLoggIn, token]);

    return (
        <>
            <LoginForm defaultData={defaultData} onSubmit={loginHandler} />
        </>
    );
};

export default Login;
