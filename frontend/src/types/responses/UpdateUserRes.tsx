import {User} from "../User";

export type UpdateUserRes = {
    status: boolean;
    data: {
        message: string,
        user: User;
    }
}