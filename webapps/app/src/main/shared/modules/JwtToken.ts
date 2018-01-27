import {parseRole, Role} from "../models/Roles";

const jwt_decode = require('jwt-decode');

export interface Token {
    permissions: string;
    roles: string;
    sub: string;
    exp: number;
}

export function isExpired(expireTime: number) {
    const now = new Date();
    // If the token has already expired
    const futureDate = new Date(now.getTime() + (5 * 60 * 1000));
    if (!expireTime || futureDate > new Date(expireTime * 1000)) {
        return true;
    }
    return false;
}

export function parseModellingGroups(roles: string) {
    return roles
        .split(",")
        .map((x: string) => parseRole(x))
        .filter((x: Role) => x.name == "member" && x.scope.prefix == "modelling-group")
        .map((x: Role) => x.scope.id);
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
