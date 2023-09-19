import { createSlice } from '@reduxjs/toolkit';
import * as Type from '../register/Types';

const initialState: Type.registerState = {
    isLoading: false,
    isSuccess: false,
    verifyToken: '',
    msg: '',
};

const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {
        reqSendDataVerify: (state, action: Type.ActionReqSendDataVerify): void => {
            state.isLoading = true;
        },
        resSendDataVerify: (state, action: Type.ActionResSendDataVerify): void => {
            const { verifyToken } = action.payload;
            state.isLoading = false;
            state.verifyToken = verifyToken;
        },
        reqSendDataRegister: (state, action: Type.ActionReqSetDataRegister): void => {
            state.isLoading = true;
            state.isSuccess = false;
        },
        resSendDataRegister: (state, action: Type.ActionResSetDataRegister): void => {
            state.isLoading = false;
            state.isSuccess = true;
        },
    },
});

export const registerActions = registerSlice.actions;
export default registerSlice.reducer;
