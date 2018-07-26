export enum OnetimeTokenActionType {
    TOKEN_FETCHED = "TOKEN_FETCHED"
}

export interface OneTimeTokenFetched {
    type: OnetimeTokenActionType.TOKEN_FETCHED;
    data: {url: string, token: string};
}

export type OnetimeTokenAction = OneTimeTokenFetched