import { all, fork } from "redux-saga/effects";
// import * as commonSaga from "src/redux/saga/common/CommonSaga";
import * as authSaga from "./auth/authSaga";
import * as registerSaga from "./register/registerSaga";
import * as userSaga from "./user/userSaga";


/**
 * Root saga
 * @return {void}
 */
export default function* rootSaga() {
    yield all([
        fork(authSaga.watchGetDataLogin),
        fork(registerSaga.watchRegister),
        fork(userSaga.watchUserFunction)
    ]);
    // yield all([fork(historySaga.watchFetchHistory)]);
}
