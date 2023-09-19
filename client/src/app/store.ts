import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import createSagaMiddleware from "@redux-saga/core";
import rootSaga from "../redux/saga/RootSaga";
import commonReducer from "../redux/reducer/common/CommonReducer";
import authReducer from "../redux/reducer/auth/authReducer";
import registerReducer from "../redux/reducer/register/register";

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
    reducer: {
        commonReducer,
        authReducer,
        registerReducer
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
    middleware: [sagaMiddleware],
});
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
