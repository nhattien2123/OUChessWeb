import { createSlice } from '@reduxjs/toolkit';
import * as Types from './Types';

const initialState: Types.adminState = {
    userList: [],
    isLoading: false,
    notify: {
        msg: '',
        type: '',
    },
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        reqGetListUser: (state, action: Types.ActionReqGetListUser) => {
            state.userList = [];
            state.isLoading = true;
            state.notify = initialState['notify'];
        },
        resGetListUser: (state, action: Types.ActionResGetListUser) => {
            const { list } = action.payload;
            state.userList = list;
            state.isLoading = false;
        },
        reqSetNotify: (state, action: Types.ActionSetNotify) => {
            const { notify } = action.payload;
            state.isLoading = false;
        },
    },
});

export const adminActions = adminSlice.actions;
export default adminSlice.reducer;

