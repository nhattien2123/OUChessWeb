import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { registerActions } from '../../redux/reducer/register/register';
import { useNavigate } from 'react-router-dom';
import Verify from '../../share/verify/verify';

import '../register/Register.scss';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
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

    const verifyFormHandle = (): void => {
        console.log(info.email);
        // dispatch(registerActions.reqSendDataVerify({ emailVerify: info.email }));
    };

    const submitHandler = (e: { preventDefault: () => void }): void => {
        dispatch(
            registerActions.reqSendDataRegister({
                info,
            }),
        );
    };

    useEffect(() => {
        if (isLoadding) {
            setStep(step + 1);
        }
        console.log(step);
    }, [isLoadding]);

    // const verfify =
    //     step === 3 ? (
    //         <Verify handler={submitHandler} email={info.email} verifyToken={verifyToken} information={info} />
    //     ) : null;

    return (
        <>
            {/* {verfify} */}
            <div className="container">
                <div className="main">
                    <div className="login-title">Đăng ký</div>
                    <div className="login-container">
                        <form className="login-input" onSubmit={(evt) => evt.preventDefault()}>
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
                                    placeholder="Phone"
                                    value={info.phone}
                                    onChange={(evt) => changeHandler(evt, 'phone')}
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
                            <div className="btn-container">
                                <button className="btn-style" onClick={(evt) => verifyFormHandle()}>
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
