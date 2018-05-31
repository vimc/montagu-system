import { AbstractLocalService } from "../../shared/services/AbstractLocalService";

export class UsersService extends AbstractLocalService {
    getAllUsers() {
        return this.setOptions({cacheKey: UserCacheKeysEnum.users})
            .get("/users/");
    }

    createUser(name :string, email:string, username:string) {
        return this
            .setOptions({exceptionOnError: false})
            .post("/users/", JSON.stringify({name, email, username}));
    }

    clearUsersListCache() {
        return this.clearCache(
            UserCacheKeysEnum.users,
            "/users/"
        );
    }

    getAllUserRoles() {
        return this.setOptions({cacheKey: UserCacheKeysEnum.roles})
            .get("/users/roles/all/");
    }
}

export enum UserCacheKeysEnum {
    users = "users",
    roles = "roles"
}