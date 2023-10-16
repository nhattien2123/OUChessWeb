import { createSlice } from '@reduxjs/toolkit';
import * as Types from 'src/redux/reducer/playersList/Types';

const initialState: Types.PlayerListState = {
    players: [],
    isLoadding: false,
    notify: {
        msg: '',
        type: '',
    },
};

const PlayerListSlice = createSlice({
    name: 'playerList',
    initialState,
    reducers: {
        ReqGetListUser: (state, action: Types.ActionReqGetListUser) => {
            state.isLoadding = true;
            state.players = initialState.players;
            state.notify = initialState.notify;
        },
        ResGetListUser: (state, action: Types.ActionResGetListUser) => {
            const { list } = action.payload;
            state.players = list;
            state.isLoadding = false;
        },
        ReqSetNotify: (state, action: Types.ActionReqSetNotify) => {
            const { notify } = action.payload;
            state.isLoadding = false;
            state.notify = notify;
        },
    },
});

export const playerListActions = PlayerListSlice.actions;
export default PlayerListSlice.reducer;

