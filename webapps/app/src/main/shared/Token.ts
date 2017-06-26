const jwt_decode = require('jwt-decode');

export interface Token {
    permissions: string;
    roles: string;
    sub: string;
    exp: number;
}

export function decodeToken(token: string ): Token {
    try {
        return jwt_decode(token);
    } catch (e) {
        console.log("Token decoding failed, token is malformed: " + token);
        return emptyToken();
    }
}

export function emptyToken(): Token {
    return {
        permissions: "",
        roles: "",
        sub: null,
        exp: null
    };
}
