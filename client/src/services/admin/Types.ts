import type { Response } from "../../config/Constants";
import { adminState, userDataForm } from "src/redux/reducer/admin/Types";
import { CommonState } from "../../redux/reducer/common/Types";

export type resFetchGetListUserFromAdmin = Response<{
    list: userDataForm[];
}>

export type resAddUserFromAdmin = Response<{
    newUser: userDataForm;
}>

export type resUpdateUserFromAdmin = Response<{
    updatedUser: userDataForm;
}>

export type resDeletedUserFromAdmin = Response<{
    deletedUser: userDataForm;
}>