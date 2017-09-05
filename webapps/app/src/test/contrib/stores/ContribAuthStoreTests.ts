import { expect } from "chai";
import { alt } from "../../../main/shared/alt";
import { expectOrderedActions } from "../../actionHelpers";
import {
    ContribAuthState,
    contribAuthStore,
    ContribAuthStoreInterface,
    initialAuthState
} from "../../../main/contrib/stores/ContribAuthStore";
import { mainStore } from "../../../main/contrib/stores/MainStore";
import { mockModellingGroup } from "../../mocks/mockModels";
import { modellingGroupActions } from "../../../main/shared/actions/ModellingGroupActions";
import { AuthStoreBaseTests } from "../../shared/stores/AuthStoreBaseTests";
const jwt = require("jsonwebtoken");

class ContribAuthStoreTests extends AuthStoreBaseTests<ContribAuthState, ContribAuthStoreInterface> {
    protected storeName(): string {
        return "ContribAuthStore";
    }

    protected getStoreState(): ContribAuthState {
        return contribAuthStore.getState();
    }

    protected expectedStateAfterLogin(token: string): ContribAuthState {
        return {
            loggedIn: true,
            modellingGroupIds: [ "test.group" ],
            modellingGroups: [],
            permissions: [ "*/can-login", "*/other" ],
            username: "test.user",
            bearerToken: token
        };
    }

    protected initialState(): ContribAuthState {
        return initialAuthState();
    }

    protected getStore(): ContribAuthStoreInterface {
        return contribAuthStore;
    }

    addTestsToMocha() {
        super.addTestsToMocha();
        it("sets modellingGroups array when modelling groups are received", () => {
            alt.bootstrap(JSON.stringify({
                ContribAuthStore: {
                    modellingGroupIds: [ "test.group" ]
                }
            }));

            const group = mockModellingGroup({ id: "test.group" });
            modellingGroupActions.updateGroups([ mockModellingGroup(), group ]);
            expect(contribAuthStore.getState().modellingGroups).to.eql([ group ]);
        });

        it("logIn with good token also invokes MainStore.load", () => {
            const spy = this.sandbox.dispatchSpy();
            const storeLoad = this.sandbox.sinon.stub(mainStore, "load");
            const token = jwt.sign({
                sub: "test.user",
                permissions: "*/can-login,*/other",
                roles: "r1,modelling-group:test.group/member"
            }, 'secret');
            contribAuthStore.logIn(token, true);
            expectOrderedActions(spy, [ { action: "AuthActions.logIn" } ], 0);
            expect(storeLoad.called).to.be.true;
            storeLoad.restore();
        });
    }
}

describe("ContribAuthStoreTests", () => {
    new ContribAuthStoreTests().addTestsToMocha();
});
