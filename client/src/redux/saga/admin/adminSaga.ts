import { call, put, takeLatest } from 'redux-saga/effects';
import httpHandler from 'src/util/HttpHandler';
import { adminActions } from 'src/redux/reducer/admin/adminReducer';
import * as ProfileServices from 'src/services/profile/ProfileServices';
import * as TypesAction from 'src/redux/reducer/playersList/Types';
import * as ProfileTypesFetch from 'src/services/profile/Types';

interface Payload {
    kw: string;
}

function* getListUser(action: TypesAction.ActionReqGetListUser) {
    try {
        const { kw } = action.payload as Payload;
        const response: ProfileTypesFetch.ResGetListUser = yield call(ProfileServices.fetchGetListUser, kw);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { list } = response.data;
                console.log(list);
                yield put(adminActions.resGetListUser({ list }));
                break;
            }
            case httpHandler.FAIL:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: 'error' } }));
                break;
            case httpHandler.SERVER_ERROR:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: 'error' } }));
                break;
            default:
                yield put(adminActions.reqSetNotify({ notify: { msg: response.message, type: 'error' } }));
                break;
        }
    } catch (error) {
        yield put(adminActions.reqSetNotify({ notify: { msg: 'Đã có lỗi xảy ra', type: 'error' } }));
    }
}

export function* watchAdminFunction() {
    yield takeLatest(adminActions.reqGetListUser.type, getListUser);
}
