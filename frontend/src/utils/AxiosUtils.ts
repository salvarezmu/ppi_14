import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

export class AxiosUtils {

    public static async get<T>(url: string, baseURL = process.env.REACT_APP_BASE_URL, params?: Record<string, unknown>): Promise<T> {
        const config: AxiosRequestConfig = {baseURL, params};
        const data: AxiosResponse = await axios.get(url, config);
        this.validateData(data);
        return data.data;
    }

    public static async post<T>(url: string, body: Record<string, unknown>, baseURL = process.env.REACT_APP_BASE_URL, params?: Record<string, unknown>): Promise<T> {
        const config: AxiosRequestConfig = {baseURL, params};
        const data: AxiosResponse = await axios.post(url, body, config);
        this.validateData(data);
        return data.data;
    }

    public static async patch<T>(url: string, body: Record<string, unknown>, baseURL = process.env.REACT_APP_BASE_URL, params?: Record<string, unknown>): Promise<T> {
        const config: AxiosRequestConfig = {baseURL, params};
        const data: AxiosResponse = await axios.patch(url, body, config);
        this.validateData(data);
        return data.data;
    }


    public static async delete<T>(url: string, baseURL = process.env.REACT_APP_BASE_URL, params: Record<string, any> = {}): Promise<T> {
        const config: AxiosRequestConfig = {baseURL, params};
        const data: AxiosResponse = await axios.delete(url, config);
        this.validateData(data);
        return data.data;
    }

    private static validateData(data: AxiosResponse): void {
        if (!data || !data.data) {
            throw Error('FAIL GETTING BACKEND');
        }
    }
}