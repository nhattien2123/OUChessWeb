import { PayloadAction } from "@reduxjs/toolkit";

export type registerState = {
    isLoading: boolean;
    isSuccess: boolean;
    verifyToken: string;
    msg: string;
}

export type ActionReqSendDataVerify = PayloadAction<{}>
export type ActionResSendDataVerify = PayloadAction<{
    verifyToken: registerState["verifyToken"];
}>
export type ActionReqSetDataRegister = PayloadAction<{}>
export type ActionResSetDataRegister = PayloadAction<{
    msg: registerState["msg"];
}>