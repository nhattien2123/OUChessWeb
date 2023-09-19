import type { Response } from "../../config/Constants"
import { registerState } from "../../redux/reducer/register/Types"

export type ResFetchSendDataVerify = Response<{
    verifyToken: registerState["verifyToken"];
}>

export type ResFetchSendDataRegister = Response<{
    msg: registerState["msg"];
}>