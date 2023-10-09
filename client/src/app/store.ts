import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import createSagaMiddleware from "@redux-saga/core";
import rootSaga from "src/redux/saga/RootSaga";
import commonReducer from "src/redux/reducer/common/CommonReducer";
import authReducer from "src/redux/reducer/auth/authReducer";
import registerReducer from "src/redux/reducer/register/register";
import userReducer from "src/redux/reducer/user/userReducer";
import historyReducer from 'src/redux/reducer/history/HistoryReducer';
import matchReducer from 'src/redux/reducer/match/MatchReducer';

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
    reducer: {
        commonReducer,
        authReducer,
        registerReducer,
        userReducer,
        historyReducer,
        matchReducer,
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
    middleware: [sagaMiddleware],
});
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
