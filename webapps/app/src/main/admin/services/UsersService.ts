import { AbstractLocalService } from "../../shared/services/AbstractLocalService";

export class UsersService extends AbstractLocalService {
    getAllUsers() {
        return this.setOptions({cacheKey: UserCacheKeysEnum.users})
            .get("/users/");
    }
}

export enum UserCacheKeysEnum {
    users = "users"
}