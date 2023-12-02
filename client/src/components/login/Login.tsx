import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { authActions } from "src/redux/reducer/auth/AuthReducer";
import { userActions } from "src/redux/reducer/user/UserReducer";
import LoginForm from "src/share/form/LoginForm";
import { socket } from "src/index";
import "src/components/login/Login.scss";
import Cookies from "js-cookie";

const Login = () => {
    const isLoggIn = useAppSelector((state: RootState) => state.authReducer.isLoggedIn);
    const token = useAppSelector((state: RootState) => state.authReducer.token);
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const defaultData = {
        username: "",
        password: "",
    };

    const loginHandler = (data: { username: string; password: string }) => {
        dispatch(authActions.reqGetDataLogin(data));
    };

    useEffect(() => {
        if (isLoggIn) {
            Cookies.set("token", token, {
                path: "/",
            });
            socket.auth = {
                token: token,
            };
            socket.disconnect();
            socket.connect();
            dispatch(userActions.reqGetCurrentUser({}));
            toast.success("Đăng nhập thành công");
            nav("/");
        }
    }, [isLoggIn, token]);

    return (
        <>
            <LoginForm defaultData={defaultData} onSubmit={loginHandler} />
        </>
    );
};

export default Login;
