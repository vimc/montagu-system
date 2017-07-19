import { AuthStateBase, AuthStore, AuthStoreBaseInterface } from "../../shared/stores/AuthStoreBase";
import { alt } from "../../shared/alt";
import StoreModel = AltJS.StoreModel;

class ReportingAuthStore extends AuthStore<AuthStateBase, AuthStoreBaseInterface<AuthStateBase>> {
    initialState(): AuthStateBase {
        return AuthStore.baseInitialState();
    }
}

export const reportingAuthStore =
    alt.createStore<AuthStateBase>(ReportingAuthStore as StoreModel<AuthStateBase>) as AuthStoreBaseInterface<AuthStateBase>;