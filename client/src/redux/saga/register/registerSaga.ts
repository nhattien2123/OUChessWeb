import { call, put, takeLatest } from 'redux-saga/effects';
import httpHandler from '../../../util/HttpHandler';
import { commonAction } from '../../reducer/common/CommonReducer';
import { registerActions } from '../../reducer/register/register';
import * as registerService from '../../../services/register/registerServices';
import * as TypesAction from '../../reducer/register/Types';
import * as TypesFetch from '../../../services/register/Types';

interface PayLoad {
    information: {
        username?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        phone?: number;
        dOb?: string;
        nation?: string;
        email?: string;
    };
    emailVerify: string;

    emailReset: string;
    passwordReset: string;
}

function* sendVerify(action: TypesAction.ActionReqSendDataVerify) {
    try {
        const { emailVerify } = action.payload as PayLoad;
        const response: TypesFetch.ResFetchSendDataVerify = yield call(registerService.sendVerify, emailVerify);
        switch (response.code) {
            case httpHandler.SUCCESS: {
                const { verifyToken } = response.data;
                yield put(registerActions.resSendDataVerify({ verifyToken }));
                break;
            }
            case httpHandler.FAIL:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            case httpHandler.SERVER_ERROR:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            default:
                break;
        }
    } catch (error) {
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

function* setDataRegister(action: TypesAction.ActionReqSetDataRegister) {
    try {
        const { information } = action.payload as PayLoad;
        // console.log(info)
        const response: TypesFetch.ResFetchSendDataRegister = yield call(registerService.sendDataRegister, {
            information: information,
        });

        switch (response.code) {
            case httpHandler.SUCCESS: {
                const msg = response.message;
                yield put(registerActions.resSendDataRegister({ msg }));
                break;
            }
            case httpHandler.FAIL: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.SERVER_ERROR: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            default:
                break;
        }
    } catch (error) {
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

function* resetPassword(action: TypesAction.ActionReqChangePassword) {
    try {
        const { emailReset, passwordReset } = action.payload as PayLoad;
        const response: TypesFetch.ResFetchChangePassword = yield call(
            registerService.resetPassword,
            emailReset,
            passwordReset,
        );

        switch (response.code) {
            case httpHandler.SUCCESS: {
                const msg = response.message;
                yield put(registerActions.resChangePasswrod({ msg }));
                break;
            }
            case httpHandler.FAIL: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            case httpHandler.SERVER_ERROR: {
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            }
            default:
                break;
        }
    } catch (error) {
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

export function* watchRegister() {
    yield takeLatest(registerActions.reqSendDataVerify.type, sendVerify);
    yield takeLatest(registerActions.reqSendDataRegister.type, setDataRegister);
    yield takeLatest(registerActions.reqChangePassword.type, resetPassword);
}
