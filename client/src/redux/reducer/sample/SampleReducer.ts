import { createSlice } from "@reduxjs/toolkit";
import * as Types from "./Types";

const initialState: Types.SampleState = {
    isLoading: false,
    isLoadingBlock: false,
    payload :{
        username:'',
        password:'',
    },
    dataSample: [],
};
const sampleSlice = createSlice({
    name: "sample",
    initialState,
    reducers: {
        reqGetDataSample: (state, action: Types.ActionReqGetDataSample) => {
            state.isLoading = true;
            state.isLoadingBlock = false;
            console.log(action);
        },
        resGetDataSample: (state, action: Types.ActionResGetDataSample) => {
            const { dataSample } = action.payload;
            state.isLoading = false;
            state.dataSample = dataSample;
        },
        reqLogin: (state, action) => {
            state.isLoading = true;
            state.isLoadingBlock = false;
            // console.log(action);
            // {userName: "dsds", password: "dsdsd"}
        },
        resLogin: (state, action) => {


        },
    },
});

export const sampleAction = sampleSlice.actions;
export default sampleSlice.reducer;