import {User} from "../User";

export type LoginRes = {
    status: boolean;
    data: {
        access_token: string;
        user: User;
    };
}

