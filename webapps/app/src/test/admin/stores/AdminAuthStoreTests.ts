import { AuthStoreBaseTests } from "../../shared/stores/AuthStoreBaseTests";
import { AuthStateBase, AuthStoreBaseInterface } from "../../../main/shared/stores/AuthStoreBase";
import { adminAuthStore } from "../../../main/admin/stores/AdminAuthStore";

class AdminAuthStoreTests extends AuthStoreBaseTests<AuthStateBase, AuthStoreBaseInterface<AuthStateBase>> {
    protected getStoreState(): AuthStateBase {
        return adminAuthStore.getState();
    }

    protected expectedStateAfterLogin(token: string): AuthStateBase {
        return {
            loggedIn: true,
            permissions: [ "*/can-login", "*/other" ],
            username: "test.user",
            bearerToken: token
        };
    }

    protected initialState(): AuthStateBase {
        return {
            username: null,
            permissions: null,
            loggedIn: false,
            bearerToken: null
        };
    }

    protected storeName(): string {
        return "AdminAuthStore";
    }

    protected getStore(): AuthStoreBaseInterface<AuthStateBase> {
        return adminAuthStore;
    }
}

describe("AdminAuthStore", () => {
    new AdminAuthStoreTests().addTestsToMocha();
});