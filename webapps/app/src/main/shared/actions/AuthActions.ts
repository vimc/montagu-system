import alt from "../alt";
import { AbstractActions } from "./AbstractActions";
import { parseRole, Role } from "../models/Roles";
import { decodeToken, Token } from "../Token";

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
        const decoded: Token = decodeToken(token);
        const permissions = decoded.permissions.split(",").filter(x => x.length > 0);
        const modellingGroups = decoded.roles
            .split(",")
            .map((x: string) => parseRole(x))
            .filter((x: Role) => x.name == "member" && x.scope.prefix == "modelling-group")
            .map((x: Role) => x.scope.id);

        const isAccountActive = permissions.some((x: string) => x == "*/can-login");
        const isModeller = modellingGroups.length > 0;

        return {
            token: token,
            username: decoded.sub,
            isAccountActive,
            isModeller,
            permissions,
            modellingGroups
        };
    }

    logOut(): boolean {
        return true;
    }
}

export const authActions = alt.createActions<Actions>(AuthActions);