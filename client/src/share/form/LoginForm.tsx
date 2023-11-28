import React from 'react';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import { useAppSelector } from 'src/app/hooks';
import { RootState } from 'src/app/store';
import 'src/components/login/Login.scss';


type Props = {
    defaultData: {
        username: string;
        password: string;
    };
    onSubmit: (data: Props["defaultData"]) => void
};

const LoginForm = (props: Props) => {
    const errorMsg = useAppSelector((state: RootState) => state.commonReducer.errorMsg);
    const { defaultData, onSubmit } = props;

    const schema = yup.object<Props['defaultData']>().shape({
        username: yup.string().required('Vui lòng nhập tên tài khoản'),
        password: yup.string().required('Vui lòng nhập mật khẩu'),
    });

    const form = useForm({
        defaultValues: defaultData,
        resolver: yupResolver(schema),
    });

    const submitHandler = (data: Props['defaultData']) => {
        onSubmit(data);
    };

    return (
        <>
            <div className="container">
                <div className="main">
                    <div className="login-title">ĐĂNG NHẬP</div>
                    <div className="login-container">
                        {errorMsg !== '' && <div className="error-block">{errorMsg}</div>}
                        <form className="login-input" onSubmit={form.handleSubmit(submitHandler)}>
                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="text"
                                    placeholder="Tên đăng nhập"
                                    {...form.register('username')}
                                ></input>
                                <ErrorMessage
                                    name="username"
                                    errors={form.formState.errors}
                                    render={({ message }) => <div className="error-msg">{message}</div>}
                                />
                            </div>

                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="password"
                                    placeholder="Mật khẩu"
                                    {...form.register('password')}
                                ></input>
                                <ErrorMessage
                                    name="password"
                                    errors={form.formState.errors}
                                    render={({ message }) => <div className="error-msg">{message}</div>}
                                />
                            </div>
                            <div className="login-feature">
                                <div id="remember-me">
                                    <input type="checkbox" name="rememberMe" />
                                    <label>Lưu tài khoản</label>
                                </div>
                                <div id="forgot-password">
                                    <Link to={'/forget'}>Quên mật khẩu</Link>
                                </div>
                            </div>
                          
                                <button type="submit" className="btn-style btn-form btn-form-save">
                                    Đăng nhập
                                </button>
                            
                        </form>
                        <div className="register-link">
                            <Link to={'/register'} className="register-dir">
                                {' '}
                                Đăng ký
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
