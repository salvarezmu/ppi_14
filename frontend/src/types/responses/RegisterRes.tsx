import {User} from "../User";

export type RegisterRes = {
    status: boolean;
    data: {
        access_token: string;
        user: User;
    };
}

