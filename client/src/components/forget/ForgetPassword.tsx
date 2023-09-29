import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Verify from '../../share/verify/verify';
import register, { registerActions } from '../../redux/reducer/register/register';
import '../forget/ForgetPassword.scss';
import { RootState } from '../../app/store';
interface ForgetPasswordProps {}

const ForgetPassword: React.FC<ForgetPasswordProps> = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [information, setInformation] = useState({
        password: '',
        confirmPassword: '',
    });
    const verifyToken = useAppSelector((state: RootState) => state.registerReducer.verifyToken);
    const dispatch = useAppDispatch();

    const verifyHandler = (e: {preventDefault: () => void}) => {
        e.preventDefault();
        // dispatch(registerActions.reqSendDataVerify({ emailVerify: email }));
        setStep(step + 1);
    };

    const resetPasswordHandler = (e: {preventDefault: () => void}) => {
        e.preventDefault();
        if(information.password === "") {
            console.log("Nhập mật khẩu");
            return;
        }
        if(information.confirmPassword === ""){
            console.log("Nhập xác nhận");
            return;
        }

        if (information.password === information.confirmPassword) setStep(step + 1);
        else console.log('Mật khẩu không trùng');
    };

    const submitHandler = (e: {preventDefault: () => void}) => {
        e.preventDefault();
        dispatch(registerActions.reqChangePassword({emailReset: email, passwordReset: information.password}));
    }

    return (
        <>
            <div className="forget-container">
                {step === 1 && (
                    <>
                        <div className="forget-title">Đặt lại mặt khẩu</div>
                        <form className="form">
                            <input
                                type="email"
                                className="input"
                                placeholder="Email xác nhận"
                                onChange={(evt) => setEmail(evt.target.value)}
                            />
                            <button className="btn" onClick={verifyHandler}>
                                Xác nhận
                            </button>
                        </form>
                    </>
                )}
                {step === 2 && (
                    <>
                        <div className="forget-title">Quên mật khẩu</div>
                        <form className="form">
                            <input
                                type="password"
                                className="input"
                                placeholder="Mật khẩu mới"
                                onChange={(evt) => setInformation({ ...information, password: evt.target.value })}
                            />
                            <input
                                type="password"
                                className="input"
                                placeholder="Xác nhận lại mật khẩu"
                                onChange={(evt) =>
                                    setInformation({ ...information, confirmPassword: evt.target.value })
                                }
                            />
                            <button className="btn" onClick={resetPasswordHandler}>
                                Xác nhận
                            </button>
                        </form>
                    </>
                )}
            </div>
            {step === 3 && (
                <>
                    <Verify handler={submitHandler} email={email} verifyToken={verifyToken} information={information} />
                </>
            )}
        </>
    );
};

export default ForgetPassword;
