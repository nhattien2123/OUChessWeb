import React, { useEffect, useRef, useState } from 'react';
import '../login/Login.scss';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { registerActions } from '../../redux/reducer/register/register';
import { useNavigate } from 'react-router-dom';
import Verify from '../../share/verify/verify';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
    const [timer, setTimer] = useState(0);
    const [step, setStep] = useState(1);
    const [info, setInfo] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        dOb: '',
        email: '',
        phone: '',
        nation: '',
        confirmPassword: '',
        avatar: '',
    });
    const verifyToken = useAppSelector((state: RootState) => state.registerReducer.verifyToken);
    const isLoadding = useAppSelector((state: RootState) => state.registerReducer.isLoading);
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    const changeHandler = (e: any, field: string) => {
        console.log(info);
        setInfo((current) => {
            if (field === 'avatar') return { ...current, [field]: e.target.files[0] };
            else return { ...current, [field]: e.target.value };
        });
    };

    const verifyFormHandle = (e: { preventDefault: () => void }): void => {
        e.preventDefault();
        dispatch(registerActions.reqSendDataVerify(info));
    };

    if (isLoadding) return <Verify email={info.email} verifyToken={verifyToken} />;

    return (
        <>
            <div className="container">
                <div className="main">
                    <div className="login-title">ĐĂNG KÝ</div>
                    <div className="login-container">
                        <form className="login-input" onSubmit={verifyFormHandle}>
                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="email"
                                    placeholder="Email"
                                    value={info.email}
                                    onChange={(evt) => changeHandler(evt, 'email')}
                                />
                            </div>

                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="text"
                                    placeholder="Tài khoản"
                                    value={info.username}
                                    onChange={(evt) => changeHandler(evt, 'username')}
                                />
                            </div>
                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="text"
                                    placeholder="Mật khẩu"
                                    value={info.password}
                                    onChange={(evt) => changeHandler(evt, 'password')}
                                />
                            </div>
                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="text"
                                    placeholder="Xác nhận mật khẩu"
                                    value={info.confirmPassword}
                                    onChange={(evt) => changeHandler(evt, 'confirmPassword')}
                                />
                            </div>
                            {/* <div className="input-container">
                                <input
                                    className="input-style"
                                    type="text"
                                    placeholder="Họ và tên đệm"
                                    value={info.firstName}
                                    onChange={(evt) => changeHandler(evt, 'firstName')}
                                />
                            </div> */}
                            {/* <div className="input-container">
                                <input
                                    className="input-style"
                                    type="text"
                                    placeholder="Tên"
                                    value={info.lastName}
                                    onChange={(evt) => changeHandler(evt, 'lastName')}
                                />
                            </div>
                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="date"
                                    placeholder="Ngày sinh"
                                    value={info.dOb}
                                    onChange={(evt) => changeHandler(evt, 'dOb')}
                                />
                            </div>

                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="text"
                                    placeholder="Phone"
                                    value={info.phone}
                                    onChange={(evt) => changeHandler(evt, 'phone')}
                                />
                            </div>
                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="text"
                                    placeholder="Nation"
                                    value={info.nation}
                                    onChange={(evt) => changeHandler(evt, 'nation')}
                                />
                            </div>
                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="file"
                                    placeholder="Avatar"
                                    onChange={(evt) => changeHandler(evt, 'avatar')}
                                />
                            </div> */}

                            <div className="btn-container">
                                <button type="submit" className="btn-style">
                                    Đăng ký
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
