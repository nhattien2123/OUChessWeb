import { PayloadAction } from "@reduxjs/toolkit";

export type Profile = {
    _id?: string,
    username: string,
    avatar: string,
    friends: Profile[],
    elo: number
}

export type CommentInfo = {
    content: string,
    userId: Profile
}

export type profileState = {
    profile: Profile;
    comments: CommentInfo[]
    mathes?: any
    isLoading: boolean
}

export type ActionReqGetProfile = PayloadAction<{}>
export type ActionResGetProfile = PayloadAction<{
    profile: profileState["profile"]
}>

export type ActionPostAddCommentInfo = PayloadAction<{}>
export type ActionReqGetCommentInfoesUser = PayloadAction<{}>
export type ActionResGetCommentInfoesUser = PayloadAction<{
    comments: profileState["comments"]
}>
