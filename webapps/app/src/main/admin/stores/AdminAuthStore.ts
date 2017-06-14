import { AuthStateBase, AuthStore, AuthStoreBaseInterface } from "../../shared/stores/AuthStoreBase";
import { alt } from "../../shared/alt";

class AdminAuthStore extends AuthStore<AuthStateBase, AuthStoreBaseInterface<AuthStateBase>> {
    initialState(): AuthStateBase {
        return {
            username: null,
            permissions: null,
            loggedIn: false,
            bearerToken: null
        }
    }
}

export const adminAuthStore = alt.createStore<AuthStateBase>(AdminAuthStore) as AuthStoreBaseInterface<AuthStateBase>;