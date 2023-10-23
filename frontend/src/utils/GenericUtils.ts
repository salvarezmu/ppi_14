import {ErrorsConstants} from "../constants/ErrorsConstants";
import {LocalStorageConstants} from "../constants/LocalStorageConstants";

import {User} from "../types/User";

export class GenericUtils {

    public static resolveError(e: any): string {
        let customMessage: string = ErrorsConstants.DEFAULT_ERROR;
        const message: string = e.response?.data.message;
        if (message) {
            const tryMessage: string = ErrorsConstants[message];
            customMessage = tryMessage ?? customMessage;
        }
        return customMessage
    }

    public static resolveLogin() {
        let isLogged: boolean = false, user: User | null = null;
        const raw_user = localStorage.getItem(LocalStorageConstants.USER);
        const access_token = localStorage.getItem(LocalStorageConstants.ACCESS_TOKEN);
        if (raw_user && access_token) {
            isLogged = true;
            user = JSON.parse(raw_user)
        }
        return {isLogged, user, access_token};
    }
}