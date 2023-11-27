import {CategoryTransactions} from "../CategoryTransaction";

export type GetAllCategoriesRes = {
    status: boolean;
    data: { categories: CategoryTransactions; trm: number};
}