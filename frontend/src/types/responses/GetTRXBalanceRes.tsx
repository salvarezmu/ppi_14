export type GetTRXBalanceRes = {
    status: boolean;
    data: {
        balance: number;
        USDBalance: number;
    };
}