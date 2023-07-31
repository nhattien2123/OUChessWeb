import { call, put, takeLatest } from "redux-saga/effects";
import httpHandler from "../../../util/HttpHandler";
import { commonAction } from "../../reducer/common/CommonReducer";
import { sampleAction } from "../../reducer/sample/SampleReducer";
import * as sampleService from "../../../services/sample/SampleService";
import * as TypesAction from "../../reducer/sample/Types";
import * as TypesFetch from "../../../services/sample/Types";

/**
 * Get data sample
 * @param {object} action
 * @return {void}
 */
interface Payload{
    username : string;
    password : string; 
}
// eslint-disable-next-line require-jsdoc
function* getDataSample(action: TypesAction.ActionReqGetDataSample) {
    try {
        const {username, password} = action.payload as Payload ;
        const response: TypesFetch.ResFetchGetDataSample = yield call(sampleService.fetchGetDataSample,username,password);
        const statusCode = response.code;
        switch (statusCode) {
            case httpHandler.SUCCESS: {
                const  {dataSample } = response.data;
                yield put(sampleAction.resGetDataSample({ dataSample }));
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
/**
 * Watch get data sample
 * @return {void}
 */
export function* watchGetDataSample() {
    yield takeLatest(sampleAction.reqGetDataSample.type, getDataSample);
}

/**
 * 
 * @param {event} action 
 */
function getLogin(action: any) {
    console.log(action);
    // {userName: "dsds", password: "dsdsd"}
}

/**
 * 
 */
export function* watchGetLogin() {
    yield takeLatest(sampleAction.reqLogin.type, getLogin);
}