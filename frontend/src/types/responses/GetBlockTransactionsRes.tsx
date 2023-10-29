import {BlockTransactions} from "../Block";

export type GetBlockTransactionsRes = {
    status: boolean;
    data: {
        transactions: BlockTransactions;
    };
}