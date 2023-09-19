import React, { useEffect, useState } from 'react';
import '../../components/login/Login.scss';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import Counter from '../counter/Counter';
import "../verify/Verify.scss"

interface verifyProps {
    email: string;
    verifyToken: string;
}

const Verify: React.FC<verifyProps> = ({ email: email, verifyToken: verifyToken }) => {
    const isLoading = useAppSelector((state: RootState) => state.registerReducer.isLoading);

    return (
        <>
            <div className="container">
                <div className="main">
                    <div className="login-title">Xác nhận tài khoản</div>
                    <div className="login-container">
                        <form className="login-input">
                            <div className='verify-container'>
                                <div className="input-container">
                                    <input className="input-style" type="text" placeholder="Mã xác nhận" />
                                </div>
                                <Counter timer={10} />
                            </div>
                            <div className="btn-container">
                                <button type="submit" className="btn-style">
                                    Xác nhận
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Verify;
