import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { RootState } from '../../app/store';
import { useDispatch } from 'react-redux';
import { registerActions } from '../../redux/reducer/register/register';
import Counter from '../counter/Counter';
import '../verify/Verify.scss';
import '../../components/login/Login.scss';

interface verifyProps {
    email?: string;
    verifyToken?: string;
    information: {
        username?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        dOb?: string;
        email?: string;
        phone?: string;
        nation?: string;
        // avatar: object;
    };
    handler: (e: { preventDefault: () => void }) => void;
}

interface verifyPayload extends JwtPayload {
    email: string;
    verifyCode: string;
}

const Verify: React.FC<verifyProps> = ({
    email: email,
    verifyToken: verifyToken,
    information: information,
    handler: handler,
}) => {
    const isLoading = useAppSelector((state: RootState) => state.registerReducer.isLoading);
    const [verifyCode, setVerifyCode] = useState('');
    const dispatch = useAppDispatch();

    // const RegisterCofirm = (e: { preventDefault: () => void }) => {
    //     e.preventDefault();
    //     if (verifyToken) {
    //         const decode: verifyPayload = jwt_decode<verifyPayload>(verifyToken);
    //         const exp = decode.exp || 0;
    //         console.log(decode);
    //         if (exp !== 0 && exp > new Date().getTime() / 1000) {
    //             const vEmail = decode.email;
    //             const vCode = decode.verifyCode;
    //             if (information['email'] === vEmail && verifyCode === vCode) {
    //                 dispatch(
    //                     registerActions.reqSendDataRegister({
    //                         information,
    //                     }),
    //                 );
    //             } else {
    //                 console.log('Fail');
    //             }
    //         } else {
    //             console.log('Quá hạn');
    //         }
    //     }
    // };

    const verifyToHandler = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (verifyToken) {
            const decode: verifyPayload = jwt_decode<verifyPayload>(verifyToken);
            const exp = decode.exp || 0;
            console.log(decode);
            if (exp !== 0 && exp > new Date().getTime() / 1000) {
                const vEmail = decode.email;
                const vCode = decode.verifyCode;
                if (information['email'] === vEmail && verifyCode === vCode) {
                    handler(e);
                } else {
                    console.log('Fail');
                }
            } else {
                console.log('Quá hạn');
            }
        }
        handler(e);
    };

    return (
        <>
            <div className="verify-container">
                <div className="verify-title">Xác nhận tài khoản</div>

                <form className="verify-form" onSubmit={verifyToHandler}>
                    <div className="verify-input">
                        <div className="input-container">
                            <input
                                className="input-style"
                                type="text"
                                placeholder="Mã xác nhận"
                                onChange={(evt) => setVerifyCode(evt.target.value)}
                            />
                        </div>
                        <Counter timer={60} />
                    </div>
                    <div className="btn-container">
                        <button type="submit" className="btn-style">
                            Xác nhận
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Verify;
