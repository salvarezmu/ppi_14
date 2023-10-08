import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

export class AxiosUtils {

    public static async get<T>(url: string): Promise<T | void> {
        try {
            const config: AxiosRequestConfig = {baseURL: process.env.REACT_APP_BASE_URL};
            const data: AxiosResponse = await axios.get(url, config);
            this.validateData(data);
            return data.data;
        } catch (e) {
            // TODO: Define what happens when there is an error
            console.error(e);
        }
    }

    private static validateData(data: AxiosResponse): void {
        if (!data || !data.data) {
            // TODO: Switch to a constants file
            throw Error('FAIL GETTING BACKEND');
        }
    }
}