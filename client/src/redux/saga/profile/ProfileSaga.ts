import { call, put, takeLatest } from 'redux-saga/effects';
import httpHandler from 'src/util/HttpHandler';
import { commonAction } from 'src/redux/reducer/common/CommonReducer';
import { profileActions } from 'src/redux/reducer/profile/profile';
import * as ProfileServices from 'src/services/profile/ProfileServices';
import * as TypesAction from 'src/redux/reducer/profile/Types';
import * as TypesFetch from 'src/services/profile/Types';
import { fetchProfile } from 'three-stdlib';

interface Payload {
    username: string;
}

function* getProfile(action: TypesAction.ActionReqGetProfile) {
    try {
        const { username } = action.payload as Payload;
        const response: TypesFetch.ResFetchGetProfile = yield call(ProfileServices.fetchProfile, username);
        const statusCode = response.code;
     
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const { profile } = response.data;
                console.log(profile);
                yield put(profileActions.resGetProfile({ profile }));
                break;
            }
            case httpHandler.FAIL:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            case httpHandler.UNAUTHORIZED:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            case httpHandler.SERVER_ERROR:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
            default:
                yield put(commonAction.displayError({ errorMsg: response.message }));
                break;
        }
    } catch (error) {
        yield put(commonAction.displayError({ errorMsg: (error as Error).message }));
    }
}

export function* watchProfle() {
    yield takeLatest(profileActions.reqGetProfile.type, getProfile);
}