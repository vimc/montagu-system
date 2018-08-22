const jwt_decode = require('jwt-decode');

export interface Token {
    permissions: string;
    roles: string;
    sub: string;
    exp: number;
}

export function emptyToken(): Token {
    return {
        permissions: "",
        roles: "",
        sub: null,
        exp: null
    };
}
