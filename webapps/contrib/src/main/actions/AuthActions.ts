import alt from "../alt";
import { AbstractActions } from "./AbstractActions";
import { parseRole, Role } from "../models/Roles";
const jwt_decode = require('jwt-decode');

export interface LogInProperties {
    token: string,
    username: string,
    isAccountActive: boolean,
    isModeller: boolean,
    permissions: string[],
    modellingGroups: string[]
}

interface Actions {
    logIn(token: string): LogInProperties;
    logOut(): boolean;
}

class AuthActions extends AbstractActions implements Actions {
    logIn(token: string): LogInProperties {
        const decoded = jwt_decode(token);
        const permissions = decoded.permissions.split(",");
        const modellingGroups = decoded.roles
            .split(",")
            .map((x: string) => parseRole(x))
            .filter((x: Role) => x.name == "member" && x.scope.prefix == "modelling-group")
            .map((x: Role) => x.scope.id);

        return {
            token: token,
            username: decoded.sub,
            isAccountActive: permissions.some((x: string) => x == "*/can-login"),
            isModeller: modellingGroups.length > 0,
            permissions,
            modellingGroups
        };
    }

    logOut(): boolean {
        return true;
    }
}

export const authActions = alt.createActions<Actions>(AuthActions);