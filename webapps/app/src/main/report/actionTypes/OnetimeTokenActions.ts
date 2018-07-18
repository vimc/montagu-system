import {OneTimeToken} from "../models/OneTimeToken";

export enum OnetimeTokenActionType {
    TOKEN_FETCHED = "TOKEN_FETCHED"
}

export interface TokenFetched {
    type: OnetimeTokenActionType.TOKEN_FETCHED;
    data: {url: string, token: OneTimeToken};
}

export type OnetimeTokenAction = TokenFetched