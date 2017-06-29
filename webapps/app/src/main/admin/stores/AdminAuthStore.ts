import { AuthStateBase, AuthStore, AuthStoreBaseInterface } from "../../shared/stores/AuthStoreBase";
import { alt } from "../../shared/alt";
import StoreModel = AltJS.StoreModel;

class AdminAuthStore extends AuthStore<AuthStateBase, AuthStoreBaseInterface<AuthStateBase>> {
    initialState(): AuthStateBase {
        return AuthStore.baseInitialState();
    }
}

export const adminAuthStore = alt.createStore<AuthStateBase>(AdminAuthStore as StoreModel<AuthStateBase>) as AuthStoreBaseInterface<AuthStateBase>;