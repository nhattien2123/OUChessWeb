import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { registerActions } from '../../redux/reducer/register/register';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Verify from '../../share/verify/verify';

import '../register/Register.scss';
import RegisterForm, { registerData } from 'src/share/form/RegisterForm';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
    const [info, setInfo] = useState<registerData>({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nation: '',
        confirmPassword: '',
        avatar: '',
    });
    const [nextStep, setNextStep] = useState<number>(1);
    const verifyToken = useAppSelector((state: RootState) => state.registerReducer.verifyToken);
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const [params] = useSearchParams();

    const verifyFormHandle = (data: any): void => {
        setInfo(data);
        setNextStep((prev) => prev + 1);
    };

    const verifyEmail = (email: string): void => {
        dispatch(registerActions.reqSendDataVerify({ emailVerify: email }));
    };

    const submitHandler = (): void => {
        dispatch(
            registerActions.reqSendDataRegister({
                information: info,
            }),
        );
    };

    useEffect(() => {
        nav(`/register?step=${nextStep}`);
    }, [nextStep]);

    useEffect(() => {
        const num = params.get("step");
        if(num !== null){
            const step = Number(num);
            if(!isNaN(step))
                setNextStep(step);
        }
    }, [])

    return (
        <>
            {nextStep === 1 ? (
                <RegisterForm registerData={info} onSubmit={verifyFormHandle} />
            ) : (
                <Verify
                    email={info.email}
                    verifyToken={verifyToken}
                    information={info}
                    setNextStep={setNextStep}
                    verify={verifyEmail}
                    handler={submitHandler}
                />
            )}
        </>
    );
};

export default Register;
