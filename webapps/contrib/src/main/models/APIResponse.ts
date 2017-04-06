export interface APIResponse {
    status: string;
    data: any;
    errors: Array<APIError>;
}

export interface APIError {
    code: string;
    message: string;
}