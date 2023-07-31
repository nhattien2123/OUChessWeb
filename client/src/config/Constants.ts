export const FORMAT_DATE: string = "YYYY/MM/DD HH:mm:00";
export type Response<Data> = {
    message: string;
    code: number;
    data: Data;
};
