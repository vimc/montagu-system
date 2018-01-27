import axios, {AxiosInstance} from 'axios';

interface RequestProps {
    baseURL: string;
    headers?: any;
    Authorization?: string;
    timeout?: number;
}

interface AxiosHeaders {
    Authorization?: string;
}

interface AxiosParams {
    baseURL: string;
    headers?: AxiosHeaders;
    timeout?: number;
}


export function request(options: RequestProps) :AxiosInstance {
    if (!options) throw new Error('no parameters given for request instance creation');
    const params: AxiosParams = {
        baseURL: options.baseURL,
        headers: {},
    };
    if (options.Authorization) {
        params.headers.Authorization = options.Authorization;
    }
    if (options.timeout) params.timeout = options.timeout;
    console.log(params)
    return axios.create(params);
}
