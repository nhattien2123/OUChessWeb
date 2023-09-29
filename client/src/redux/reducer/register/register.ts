import { createSlice } from '@reduxjs/toolkit';
import * as Type from '../register/Types';
import { stat } from 'fs';

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
        reqCheckDataRegister: (state, action) => {

        },
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
        reqChangePassword: (state, action: Type.ActionReqChangePassword): void => {
            state.isLoading = true;
            state.isSuccess = false;
        },
        resChangePasswrod: (state, action:Type.ActionResChangePassword): void => {
            state.isLoading = false;
            state.isSuccess = true;
        }
    },
});

export const registerActions = registerSlice.actions;
export default registerSlice.reducer;
