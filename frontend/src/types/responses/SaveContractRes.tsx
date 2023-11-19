import {Contract} from "../Contract";

export type SaveContractRes = {
    status: boolean,
    data: {
        contract: Contract;
    }
}