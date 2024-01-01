import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { registerActions } from "src/redux/reducer/register/Register";
import RegisterForm, { registerData } from "src/share/form/RegisterForm";
import Verify from "src/share/verify/Verify";
import "src/components/register/Register.scss";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
    const [info, setInfo] = useState<registerData>({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nation: "",
        confirmPassword: "",
        avatar: "",
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
        if (num !== null) {
            const step = Number(num);
            if (!isNaN(step)) setNextStep(step);
        }
    }, []);

    return (
        <>
            <div className="auth__container">
                <div className="form__container register__form">
                    <RegisterForm registerData={info} onSubmit={verifyFormHandle} />
                </div>
                {/* <div className="verify__container">
                    <Verify
                        email={""}
                        verifyToken={""}
                        information={info}
                        setNextStep={setNextStep}
                        verify={(str) => {}}
                        handler={() => {}}
                    />
                </div> */}
            </div>

            {/* {nextStep === 1 ? ( */}
        </>
    );
};

export default Register;
