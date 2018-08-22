import {jwtTokenAuth} from "../../shared/modules/jwtTokenAuth";

const jwt_decode = require('jwt-decode');

export interface OneTimeToken {
    raw: string;
    data: OneTimeTokenData;
}

export interface OneTimeTokenData {
    iss: string;
    sub: string;
    exp: number;
    permissions: string[];
    roles: string[];
    url: string;
    nonce: string;
}

export function emptyOneTimeTokenData(): OneTimeTokenData {
    return {
        iss: null,
        sub: null,
        exp: 0,
        permissions: [],
        roles: [],
        url: null,
        nonce: null
    };
}