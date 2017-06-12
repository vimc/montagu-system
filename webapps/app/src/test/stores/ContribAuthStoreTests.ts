import { expect } from "chai";
import { Sandbox } from "../Sandbox";
import { alt } from "../../main/shared/alt";
import { authActions, LogInProperties } from "../../main/shared/actions/AuthActions";
import { expectOrderedActions } from "../actionHelpers";
import { ContribAuthState, contribAuthStore, initialAuthState } from "../../main/contrib/stores/ContribAuthStore";
import { initialMainState, mainStore } from "../../main/contrib/stores/MainStore";
import { mockModellingGroup } from "../mocks/mockModels";
import { modellingGroupActions } from "../../main/contrib/actions/ModellingGroupActions";
const jwt = require("jsonwebtoken");

describe("ContribAuthStore", () => {
    const sandbox = new Sandbox();

    beforeEach(() => {
        alt.recycle();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("handles logIn event", () => {
        const token = jwt.sign({
            sub: "test.user",
            permissions: "*/can-login,*/other",
            roles: "r1,modelling-group:test.group/member"
        }, 'secret');
        authActions.logIn(token);

        const expected: ContribAuthState = {
            loggedIn: true,
            modellingGroupIds: [ "test.group" ],
            modellingGroups: [],
            permissions: [ "*/can-login", "*/other" ],
            username: "test.user",
            bearerToken: token
        };
        expect(contribAuthStore.getState()).to.eql(expected);
    });

    it("sets modellingGroups array when modelling groups are received", () => {
        alt.bootstrap(JSON.stringify({
            ContribAuthStore: {
                modellingGroupIds: [ "test.group" ]
            }
        }));

        const group = mockModellingGroup({ id: "test.group" });
        modellingGroupActions.update([ mockModellingGroup(), group ]);
        expect(contribAuthStore.getState().modellingGroups).to.eql([ group ]);
    });

    it("clears everything on logOut", () => {
        alt.bootstrap(JSON.stringify({
            ContribAuthStore: {
                loggedIn: true,
                username: "username",
                bearerToken: "TOKEN",
                permissions: [ "p1", "p2" ],
                modellingGroups: [ "group-1" ]
            },
            MainStore: {
                ready: true
            }
        }));
        authActions.logOut();
        expect(contribAuthStore.getState()).to.eql(initialAuthState());
        expect(mainStore.getState()).to.eql(initialMainState());
    });

    it("logIn invokes logIn action", () => {
        const spy = sandbox.dispatchSpy();
        const storeLoad = sandbox.sinon.stub(mainStore, "load");
        const token = "TOKEN";
        contribAuthStore.logIn(token);
        const expectedPayload: LogInProperties = {
            token: "TOKEN",
            username: null,
            modellingGroups: [],
            permissions: [],
            isModeller: false,
            isAccountActive: false
        };
        expectOrderedActions(spy, [{ action: "AuthActions.logIn", payload: expectedPayload }], 0);
        expect(storeLoad.called).to.be.false;
        storeLoad.restore();
    });

    it("logIn with good token also invokes MainStore.load", () => {
        const spy = sandbox.dispatchSpy();
        const storeLoad = sandbox.sinon.stub(mainStore, "load");
        const token = jwt.sign({
            sub: "test.user",
            permissions: "*/can-login,*/other",
            roles: "r1,modelling-group:test.group/member"
        }, 'secret');
        contribAuthStore.logIn(token);
        expectOrderedActions(spy, [{ action: "AuthActions.logIn" }], 0);
        expect(storeLoad.called).to.be.true;
        storeLoad.restore();
    });
});
