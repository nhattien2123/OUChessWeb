import { createSlice } from '@reduxjs/toolkit';
import * as Types from 'src/redux/reducer/profile/Types';

const initialState: Types.profileState = {
    profile: {
        _id: '',
        username: '',
        avatar: '',
        friends: [],
        elo: 0
    },
    comments: [],
    isLoading: false,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        reqGetProfile: (state, action: Types.ActionReqGetProfile): void => {
            state.isLoading = true;
            
        },
        resGetProfile: (state, action: Types.ActionResGetProfile): void => {
            const { profile } = action.payload;
            state.profile = profile;
            state.isLoading = false;
        },
        reqGetCommentInfoesUser: (state, action: Types.ActionReqGetCommentInfoesUser): void => {},
        resGetCommentInfoesUser: (state, action: Types.ActionResGetCommentInfoesUser): void => {},
        postAddCommentInfo: (state, action: Types.ActionPostAddCommentInfo): void => {},
    },
});

export const profileActions = profileSlice.actions;
export default profileSlice.reducer;
