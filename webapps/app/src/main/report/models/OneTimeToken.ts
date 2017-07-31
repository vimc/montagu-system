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

export function decodeOneTimeToken(token: string): OneTimeToken {
    try {
        return {
            raw: token,
            data: jwt_decode(token),
        };
    } catch (e) {
        console.log("Onetime token decoding failed, token is malformed: " + token);
        return {
            raw: token,
            data: emptyOneTimeTokenData()
        };
    }
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