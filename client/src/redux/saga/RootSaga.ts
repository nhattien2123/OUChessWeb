import { all, fork } from "redux-saga/effects";
// import * as commonSaga from "src/redux/saga/common/CommonSaga";
import * as authSaga from "./auth/authSaga";
import * as registerSaga from "./register/registerSaga";
import * as userSaga from "./user/userSaga";
import * as historySaga from "src/redux/saga/history/historySaga";
import * as matchSaga from 'src/redux/saga/match/MatchSaga';

/**
 * Root saga
 * @return {void}
 */
export default function* rootSaga() {
    yield all([
        fork(authSaga.watchGetDataLogin),
        fork(registerSaga.watchRegister),
        fork(userSaga.watchUserFunction),
        // fork(historySaga.watchHistoryFunction),
        fork(matchSaga.watchMatchFunction),
    ]);
}
