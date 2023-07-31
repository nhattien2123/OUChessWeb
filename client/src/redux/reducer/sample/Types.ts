import { PayloadAction } from "@reduxjs/toolkit";

export type SampleState = {
    isLoading: boolean;
    isLoadingBlock: boolean;
    payload :{
        username : string;
        password : string;
    }
    dataSample: [];

};


export type ActionReqGetDataSample = PayloadAction<{}>;

export type ActionResGetDataSample = PayloadAction<{
    dataSample: SampleState["dataSample"];
}>;