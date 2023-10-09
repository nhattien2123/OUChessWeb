import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { RootState } from 'src/app/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerActions } from 'src/redux/reducer/register/register';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';

type Props = {
    registerData: {
        username: string;
        password: string;
        firstName?: string;
        lastName?: string;
        email: string;
        phone: string;
        nation?: string;
        confirmPassword: string;
        avatar?: string;
    };

    onSubmit: (data: Props['registerData']) => void;
};

const RegisterForm = (props: Props) => {
    const { registerData, onSubmit } = props;
    const dispatch = useAppDispatch();
    const errors = useAppSelector((state: RootState) => state.registerReducer.errors);
    const isLoading = useAppSelector((state: RootState) => state.registerReducer.isLoading);

    const schema = yup.object<Props['registerData']>().shape({
        username: yup.string().required('Vui lòng nhập tên tài khoản'),
        password: yup.string().required('Vui lòng nhập mật khẩu'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password'), ''], 'Mật khẩu không khớp')
            .required('Vui lòng nhập mật khẩu xác nhận'),
        email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
        phone: yup.string().required('Vui lòng nhập số điện thoại'),
        firstname: yup.string(),
        lastName: yup.string(),
        nation: yup.string(),
        avatar: yup.string(),
    });

    const form = useForm({
        defaultValues: registerData,
        resolver: yupResolver(schema),
    });

    const {submitCount} = form.formState;

    const submitHandler = async (data: Props['registerData']) => {
        await dispatch(
            registerActions.reqCheckExist({
                fieldCheck: {
                    username: data.username,
                    email: data.email,
                    phone: data.phone,
                },
            }),
        )

    };

    useEffect(() => {
        const isErros: boolean = Object.keys(errors).length > 0;
        if(isErros){
            if (errors.email) {
                form.setError('email', {
                    message: errors.email.message,
                });
            }
            if (errors.phone) {
                form.setError('phone', {
                    message: errors.phone.message,
                });
            }
            if (errors.username) {
                form.setError('username', {
                    message: errors.username.message,
                });
            }
        }else {
            if(submitCount > 0 && !isLoading){
                onSubmit(form.getValues())
            }
        }


    }, [errors, isLoading]);

    return (
        <>
            <div className="container">
                <div className="main">
                    <div className="login-title">Đăng ký</div>
                    <div className="login-container">
                        <form className="login-input" onSubmit={form.handleSubmit(submitHandler)}>
                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="email"
                                    placeholder="Email"
                                    {...form.register('email')}
                                />
                                <ErrorMessage
                                    name="email"
                                    errors={form.formState.errors}
                                    render={({ message }) => <div className="error-msg">{message}</div>}
                                />
                            </div>
                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="text"
                                    placeholder="Phone"
                                    {...form.register('phone')}
                                />
                                <ErrorMessage
                                    name="phone"
                                    errors={form.formState.errors}
                                    render={({ message }) => <div className="error-msg">{message}</div>}
                                />
                            </div>

                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="text"
                                    placeholder="Tài khoản"
                                    {...form.register('username')}
                                />
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
                                />
                                <ErrorMessage
                                    name="password"
                                    errors={form.formState.errors}
                                    render={({ message }) => <div className="error-msg">{message}</div>}
                                />
                            </div>
                            <div className="input-container">
                                <input
                                    className="input-style"
                                    type="password"
                                    placeholder="Xác nhận mật khẩu"
                                    {...form.register('confirmPassword')}
                                />
                                <ErrorMessage
                                    name="confirmPassword"
                                    errors={form.formState.errors}
                                    render={({ message }) => <div className="error-msg">{message}</div>}
                                />
                            </div>
                            <button disabled={isLoading} className="btn-style btn-form btn-form-save">
                                Đăng ký
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterForm;