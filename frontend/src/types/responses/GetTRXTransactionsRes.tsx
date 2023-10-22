import {TRXTransactions} from "../TRXTransaction";

export type GetTRXTransactionsRes = {
    status: boolean;
    data: TRXTransactions;
}