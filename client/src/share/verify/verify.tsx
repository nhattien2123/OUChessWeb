import React, { Dispatch, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { RootState } from '../../app/store';
import { useDispatch } from 'react-redux';
import { registerActions } from '../../redux/reducer/register/register';
import Counter from '../counter/Counter';
import '../verify/Verify.scss';
import '../../components/login/Login.scss';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface verifyProps {
    email: string;
    verifyToken?: string;
    information?: {
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
    setNextStep: Dispatch<React.SetStateAction<number>>;
    verify: (email: string) => void;
    handler: () => void;
}

interface verifyPayload extends JwtPayload {
    email: string;
    verifyCode: string;
}

const Verify: React.FC<verifyProps> = ({
    email: email,
    verifyToken: verifyToken,
    information: information,
    setNextStep: setNextStep,
    verify: verify,
    handler: handler,
}) => {
    const isLoading = useAppSelector((state: RootState) => state.registerReducer.isLoading);
    const [verifyCode, setVerifyCode] = useState('');
    const [isReset, setReset] = useState<boolean>(true);
    const [timer, setTimer] = useState<number>(60);
    const [error, setError]= useState<string>("");
    const nav = useNavigate();

    useEffect(() => {
        if(isReset){
            verify(email);
            setReset(false);
        }
    }, [isReset])

    const verifyToHandler = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        console.log(verifyToken);
        if (verifyToken) {
            const decode: verifyPayload = jwt_decode<verifyPayload>(verifyToken);
            const exp = decode.exp || 0;
            if (exp !== 0 && exp > new Date().getTime() / 1000) {
                const vEmail = decode.email;
                const vCode = decode.verifyCode;
                if (email === vEmail && verifyCode === vCode) {
                    handler();
                    nav("/login");
                } else {
                    setError("Mã xác nhận không trùng khớp")
                }
            } else {
                setError("Mã xác nhận đã quá hạn")
            }
        }
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
                                onBlur={(evt) => setError("")}
                            />
                            {error !== "" && <div className='error-msg'>{error}</div>}
                        </div>
                        <Counter timer={timer} setReset={setReset} />
                    </div>

                    <button type="submit" className="btn-style btn-form btn-form-save">
                        Xác nhận
                    </button>
                </form>
                <div
                    style={{ margin: '10px auto', padding: '10px', textAlign: 'center' }}
                    className="w-10 btn-form"
                    onClick={(evt) => {
                        setNextStep((prev) => prev - 1)
                    }}
                >
                    back
                </div>
            </div>
        </>
    );
};

export default Verify;
