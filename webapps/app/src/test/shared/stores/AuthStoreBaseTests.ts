import { expect } from "chai";
import { Sandbox } from "../../Sandbox";
import { alt } from "../../../main/shared/alt";
import { authActions, LogInProperties } from "../../../main/shared/actions/AuthActions";
import { AuthStoreBaseInterface } from "../../../main/shared/stores/AuthStoreBase";
import { notificationStore } from "../../../main/shared/stores/NotificationStore";
import { expectOrderedActions } from "../../actionHelpers";
const jwt = require("jsonwebtoken");

export abstract class AuthStoreBaseTests<TState, TInterface extends AuthStoreBaseInterface<TState>> {
    protected abstract getStoreState(): TState;
    protected abstract expectedStateAfterLogin(token: string): TState;
    protected abstract initialState(): TState;
    protected abstract storeName(): string;
    protected abstract getStore(): TInterface;
    protected sandbox: Sandbox;

    constructor() {
        this.sandbox = new Sandbox();
    }

    addTestsToMocha() {

        beforeEach(() => {
            alt.recycle();
        });

        afterEach(() => {
            this.sandbox.restore();
        });

        it("handles logIn event", () => {
            const token = jwt.sign({
                sub: "test.user",
                permissions: "*/can-login,*/other",
                roles: "r1,modelling-group:test.group/member"
            }, 'secret');
            authActions.logIn(token);
            expect(this.getStoreState()).to.eql(this.expectedStateAfterLogin(token));
        });

        it("clears everything on logOut", () => {
            const stores: any = {};
            stores[this.storeName()] = {
                loggedIn: true,
                username: "username",
                bearerToken: "TOKEN",
                permissions: [ "p1", "p2" ],
                modellingGroups: [ "group-1" ]
            };
            stores["NotificationStore"] = {
                errors: [ "Some error " ]
            };
            alt.bootstrap(JSON.stringify(stores));
            authActions.logOut();
            expect(this.getStoreState()).to.eql(this.initialState());
            expect(notificationStore.getState()).to.eql({
                errors: [],
                infos: []
            });
        });

        it("logIn invokes logIn action", () => {
            const spy = this.sandbox.dispatchSpy();
            const token = "TOKEN";
            this.getStore().logIn(token);
            const expectedPayload: LogInProperties = {
                token: "TOKEN",
                username: null,
                modellingGroups: [],
                permissions: [],
                isModeller: false,
                isAccountActive: false
            };
            expectOrderedActions(spy, [{ action: "AuthActions.logIn", payload: expectedPayload }], 0);
        });
    }
}