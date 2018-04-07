
export enum EstimatesTypes {
    ESTIMATES_ONE_TIME_TOKEN_FETCHED = "ESTIMATES_ONE_TIME_TOKEN_FETCHED",
    ESTIMATES_ONE_TIME_TOKEN_CLEAR = "ESTIMATES_ONE_TIME_TOKEN_CLEAR",
    ESTIMATES_SET_REDIRECT_PATH = "ESTIMATES_SET_REDIRECT_PATH"
}

export interface EstimatesOneTimeTokenFetched {
    type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_FETCHED;
    data: string;
}

export interface EstimatesOneTimeTokenClear {
    type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_CLEAR;
}

export interface EstimatesSetRedirectPath {
    type: EstimatesTypes.ESTIMATES_SET_REDIRECT_PATH;
    data: string;
}

export type EstimatesAction =
    | EstimatesOneTimeTokenFetched
    | EstimatesOneTimeTokenClear
    | EstimatesSetRedirectPath
