import type { Response } from "../../config/Constants";
import { SampleState } from "../../redux/reducer/sample/Types";

export type ResFetchGetDataSample = Response<{
    dataSample: SampleState["dataSample"];
}>;