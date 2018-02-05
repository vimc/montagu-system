import axios, {AxiosInstance} from 'axios';

export interface RequestOptionsProps {
    baseURL?: string;
    Authorization?: string;
    timeout?: number;
    withCredentials?: boolean;
}

interface AxiosHeaders {
    Authorization?: string;
}

interface AxiosParams {
    baseURL: string;
    headers?: AxiosHeaders;
    timeout?: number;
    withCredentials?: boolean;
}

export function axiosRequest(options: RequestOptionsProps) :AxiosInstance {
    if (!options) throw new Error('no parameters given for request instance creation');
    const params: AxiosParams = {
        baseURL: options.baseURL,
        headers: {},
    };
    if (options.Authorization) {
        params.headers.Authorization = options.Authorization;
    }
    if (options.timeout) params.timeout = options.timeout;
    if (options.withCredentials) params.withCredentials = options.withCredentials;
    return axios.create(params);
}
