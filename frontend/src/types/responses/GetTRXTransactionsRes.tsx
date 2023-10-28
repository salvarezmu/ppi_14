import {TRXTransactions} from "../TRXTransaction";
import {BasicStatistics} from "../BasicStatistics";

export type GetTRXTransactionsRes = {
    status: boolean;
    data: { transactions: TRXTransactions, statistics: BasicStatistics };
}