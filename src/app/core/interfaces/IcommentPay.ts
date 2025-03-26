import { IPagos } from "./Ipayments";

export interface ICommentPay{
    id: number;
    descripcion:string;
    pagos: IPagos
}