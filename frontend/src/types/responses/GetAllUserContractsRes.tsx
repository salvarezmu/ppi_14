import {Contract} from "../Contract";

export type GetAllUserContractsRes = {
    status: boolean;
    data: {
        "contracts": Array<Contract>,
    }
}