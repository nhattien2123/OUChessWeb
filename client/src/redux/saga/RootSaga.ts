import { all, fork } from "redux-saga/effects";
// import * as commonSaga from "src/redux/saga/common/CommonSaga";
import * as authSaga from "./auth/authSaga";



/**
 * Root saga
 * @return {void}
 */
export default function* rootSaga() {
    yield all([
        fork(authSaga.watchGetDataLogin),
    ]);
    // yield all([fork(historySaga.watchFetchHistory)]);
}
