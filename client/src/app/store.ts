import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import createSagaMiddleware from "@redux-saga/core";
import rootSaga from "src/redux/saga/RootSaga";
import commonReducer from "src/redux/reducer/common/CommonReducer";
import authReducer from "src/redux/reducer/auth/authReducer";
import registerReducer from "src/redux/reducer/register/register";
import historyReducer from 'src/redux/reducer/history/HistoryReducer';
import matchReducer from 'src/redux/reducer/match/MatchReducer';
import userReducer from "src/redux/reducer/user/userReducer";
import messageReducer from "src/redux/reducer/messages/messages";
import profileReducer from "src/redux/reducer/profile/profile";
import messageMatchReducer from "src/redux/reducer/messageMatch/MessageMatchReducer";
import opponentReducer from "src/redux/reducer/opponent/OpponentReducer";
import playerReducer from "src/redux/reducer/player/PlayerReducer";
import gameSettingsReducer from "src/redux/reducer/gameSettings/GameSettingsReducer"
import PlayerListReducer from "src/redux/reducer/playersList/PlayerList";

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
    reducer: {
        commonReducer,
        authReducer,
        registerReducer,
        userReducer,
        historyReducer,
        matchReducer,
        messageReducer,
        profileReducer,
        messageMatchReducer,
        opponentReducer,
        playerReducer,
        gameSettingsReducer,
        PlayerListReducer
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
    middleware: [sagaMiddleware],
});
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
