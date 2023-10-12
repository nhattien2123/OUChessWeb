import { PayloadAction } from "@reduxjs/toolkit";

export type Friend = {
    requester: Profile,
    recipient: Profile,
    status: number
}

export type Profile = {
    _id?: string,
    username: string,
    avatar: string,
    friends?: Friend[],
    elo?: number
}

export type CommentInfo = {
    content: string,
    receiver: Profile,
    sender: Profile
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

export type ActionPostAddCommentInfo = PayloadAction<{
    comment: CommentInfo
}>
export type ActionReqGetCommentInfoesUser = PayloadAction<{}>
export type ActionResGetCommentInfoesUser = PayloadAction<{
    comments: profileState["comments"]
}>
