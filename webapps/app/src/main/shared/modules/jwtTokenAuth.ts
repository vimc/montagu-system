import {parseRole, Role} from "../models/Roles";
import {AuthState, loadAuthState} from "../reducers/authReducer";
import * as pako from "pako";

const jwt_decode = require('jwt-decode');

export interface AuthTokenData {
    permissions: string;
    roles: string;
    sub: string;
    exp: number;
}

export const jwtTokenAuth = {

    isExpired(expireTime: number) {
        const now = new Date();
        // If the token has already expired
        const futureDate = new Date(now.getTime() + (5 * 60 * 1000));
        if (!expireTime || futureDate > new Date(expireTime * 1000)) {
            return true;
        }
        return false;
    },

    decodeToken(token: string): AuthTokenData {
        try {
            return jwt_decode(token);
        }
        catch(e){
            console.log(`Token decoding failed. Token is malformed: ${token}`);
            return null;
        }
    },

    inflateToken(token: string): string {
        try {
            // https://stackoverflow.com/a/44528376/777939
            const decoded = atob(token.replace(/_/g, '/').replace(/-/g, '+'));
            return pako.inflate(decoded, {to: 'string'});
        }
        catch(e){
            console.log(`Token inflation failed: ${token}.`);
            return null;
        }
    },

    parseModellingGroups(roles: string): string[] {
        return roles
            .split(",")
            .map((x: string) => parseRole(x))
            .filter((x: Role) => x.name == "member" && x.scope.prefix == "modelling-group")
            .map((x: Role) => x.scope.id);
    },

    getDataFromCompressedToken(token: string): AuthState {
        const inflated = this.inflateToken(token);
        const decoded = this.decodeToken(inflated);
        const permissions = decoded.permissions.split(",").filter((x: string) => x.length > 0);
        const modellingGroups = this.parseModellingGroups(decoded.roles);

        const result = loadAuthState( {
            username: decoded.sub,
            receivedBearerToken: true,
            receivedCookies: false,
            bearerToken: token,
            permissions: permissions,
            modellingGroups: modellingGroups
        });

        return result;
    },

    isCompressedTokenValid(token: string): boolean {
        const inflated = jwtTokenAuth.inflateToken(token);
        if (inflated != null) {
            const decoded = jwtTokenAuth.decodeToken(inflated);
            if (decoded != null) {
                return !jwtTokenAuth.isExpired(decoded.exp);
            }
        }
        return false;
    }
};