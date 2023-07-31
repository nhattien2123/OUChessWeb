import { all, fork } from "redux-saga/effects";
// import * as commonSaga from "src/redux/saga/common/CommonSaga";
import * as sampleSag from "./sample/SampleSaga";


/**
 * Root saga
 * @return {void}
 */
export default function* rootSaga() {
    yield all([
        fork(sampleSag.watchGetDataSample),
        fork(sampleSag.watchGetLogin),
    ]);
}
