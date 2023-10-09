import type { Response } from "src/config/Constants";
import { profileState } from "src/redux/reducer/profile/Types";

export type ResFetchGetProfile = Response<{
    profile: profileState["profile"]
}>

export type ResFetchGetCommentInfoUser = Response<{
    comments: profileState["comments"]
}>

