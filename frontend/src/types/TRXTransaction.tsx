/* Los parametros son:
*  1. TXID
*  2. Amount
*  3. Timestamp
*  4. Owner Address
*  5. To Address
*  6. Coin Symbol
* */

export type TRXTransactions = Array<TRXTransaction>;

export type TRXTransaction = [string, number, number, string, string, string, string, number];