export enum OnetimeTokenActionType {
    TOKEN_FETCHED = "TOKEN_FETCHED",
    TOKEN_INVALIDATED = "TOKEN_INVALIDATED"
}

export interface OneTimeTokenFetched {
    type: OnetimeTokenActionType.TOKEN_FETCHED;
    data: { url: string, token: string };
}

export interface OneTimeTokenInvalidated {
    type: OnetimeTokenActionType.TOKEN_INVALIDATED;
    data: string;
}

export type OnetimeTokenAction = OneTimeTokenFetched
    | OneTimeTokenInvalidated