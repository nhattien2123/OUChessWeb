import React, { useEffect } from "react";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import "src/components/login/Login.scss";
import "src/Common.scss"
import { toast } from "react-toastify";

type Props = {
    defaultData: {
        username: string;
        password: string;
    };
    onSubmit: (data: Props["defaultData"]) => void;
};

const LoginForm = (props: Props) => {
    const errorMsg = useAppSelector((state: RootState) => state.commonReducer.errorMsg);
    const { defaultData, onSubmit } = props;

    const schema = yup.object<Props["defaultData"]>().shape({
        username: yup.string().required("Vui lòng nhập tên tài khoản"),
        password: yup.string().required("Vui lòng nhập mật khẩu"),
    });

    const form = useForm({
        defaultValues: defaultData,
        resolver: yupResolver(schema),
    });

    const submitHandler = (data: Props["defaultData"]) => {
        onSubmit(data);
    };

    useEffect(() => {
        if(errorMsg !== ""){
            toast.error(errorMsg);
        }
    }, [errorMsg])

    return (
        <>
            <div className="login__container">
                <div className="login__title">ĐĂNG NHẬP</div>
                <div className="input__container w-70">
                    {/* {errorMsg !== "" && <div className="error__block">{errorMsg}</div>} */}
                    <form className="input__form w-100" onSubmit={form.handleSubmit(submitHandler)}>
                        <div className="textbox__container">
                            <input
                                className="textbox__style"
                                type="text"
                                placeholder="Tên đăng nhập"
                                {...form.register("username")}
                            ></input>
                            <ErrorMessage
                                name="username"
                                errors={form.formState.errors}
                                render={({ message }) => <div className="error-msg">{message}</div>}
                            />
                        </div>

                        <div className="textbox__container">
                            <input
                                className="textbox__style"
                                type="password"
                                placeholder="Mật khẩu"
                                {...form.register("password")}
                            ></input>
                            <ErrorMessage
                                name="password"
                                errors={form.formState.errors}
                                render={({ message }) => <div className="error-msg">{message}</div>}
                            />
                        </div>

                        <div className="login__feature">
                            <div id="remember__me">
                                <input type="checkbox" id="rememberMe" name="rememberMe" />
                                <label htmlFor="rememberMe">Lưu tài khoản</label>
                            </div>
                            <div id="forgot__password">
                                <Link to={"/forget"} className="link__style">Quên mật khẩu</Link>
                            </div>
                        </div>

                        <div className="login__button">
                            <button type="submit" className="btn__style btn__create w-60 p-3" style={{margin: "10px auto"}}>
                                ĐĂNG NHẬP
                            </button>
                        </div>
                    </form>
                    <div className="register__link">
                        <Link to={"/register"} className="link__style">
                            {" "}
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
