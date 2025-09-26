import {AbstractLocalService} from "../../shared/services/AbstractLocalService";
import {AssociateRole, Result} from "../../shared/models/Generated";

export class UsersService extends AbstractLocalService {
    getAllUsers() {
        return this.setOptions({cacheKey: UserCacheKeysEnum.users})
            .get("/users/");
    }

    createUser(name :string, email:string, username:string): Promise<Result> {
        return this
            .setOptions({notificationOnError: false})
            .post("/users/", JSON.stringify({name, email, username}));
    }

    clearUsersListCache() {
        return this.clearCache(
            UserCacheKeysEnum.users,
            "/users/"
        );
    }

    getGlobalRoles() {
        return this.setOptions({cacheKey: UserCacheKeysEnum.roles})
            .get("/users/roles/all/");
    }

    addGlobalRoleToUser(username: string, role: string) {
        const associateRole: AssociateRole = {
            name: role,
            action: "add",
            scope_prefix: null,
            scope_id: null
        };
        return this
            .post(`/users/${username}/actions/associate-role/`, JSON.stringify(associateRole));
    }

    removeRoleFromUser(username: string, role: string, scopeId: string, scopePrefix: string) {
        const associateRole: AssociateRole = {
            name: role,
            action: "remove",
            scope_prefix: scopePrefix,
            scope_id: scopeId
        };
        return this
            .post(`/users/${username}/actions/associate-role/`, JSON.stringify(associateRole));
    }

    setPassword(resetToken: string, newPassword: string): Promise<Result> {
        return this
            .setOptions({notificationOnError: false})
            .post(`/password/set/?access_token=${resetToken}`, JSON.stringify({ password: newPassword }));
    }
}

export enum UserCacheKeysEnum {
    users = "users",
    roles = "roles"
}