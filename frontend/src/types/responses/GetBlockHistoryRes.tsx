import {Blocks} from "../Block";

export type GetBlockHistoryRes = {
    status: boolean;
    data: {
        blocks: Blocks,
    }
}