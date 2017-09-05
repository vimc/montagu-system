import { expect } from "chai";
import { Sandbox } from "../../Sandbox";
import { alt } from "../../../main/shared/alt";
import { authActions, LogInProperties } from "../../../main/shared/actions/AuthActions";
import { AuthStoreBaseInterface, tokenStorageHelper } from "../../../main/shared/stores/AuthStoreBase";
import { notificationStore } from "../../../main/shared/stores/NotificationStore";
import { expectNoActions, expectOneAction, expectOrderedActions } from "../../actionHelpers";
import { ILookup } from "../../../main/shared/models/Lookup";
import { withMockLocalStorage } from "../../mocks/mocks";
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

        const goodToken: string = jwt.sign({
            sub: "test.user",
            permissions: "*/can-login,*/other",
            roles: "r1,modelling-group:test.group/member"
        }, 'secret');

        it("handles logIn event", () => {
            authActions.logIn(goodToken, true);
            expect(this.getStoreState()).to.eql(this.expectedStateAfterLogin(goodToken));
        });

        it("on logIn event, saves token to localStorage", () => {
            const lookup: ILookup<string> = {};
            withMockLocalStorage(lookup, () => {
                authActions.logIn(goodToken, true);
            });
            expect(lookup["accessToken"]).to.equal(goodToken);
        });

        it("clears everything on logOut", () => {
            const stores: any = {};
            stores[this.storeName()] = {
                loggedIn: true,
                username: "username",
                bearerToken: "TOKEN",
                permissions: ["p1", "p2"],
                modellingGroups: ["group-1"]
            };
            stores["NotificationStore"] = {
                errors: ["Some error "]
            };
            alt.bootstrap(JSON.stringify(stores));
            authActions.logOut();
            expect(this.getStoreState()).to.eql(this.initialState());
            expect(notificationStore.getState()).to.eql({
                errors: [],
                infos: []
            });
        });

        it("clears localStorage on logOut", () => {
            withMockLocalStorage({}, () => {
                const spy = this.sandbox.sinon.spy(localStorage, "clear");
                authActions.logOut();
                expect(spy.called).to.be.true;
            });
        });

        it("logIn invokes logIn action", () => {
            const spy = this.sandbox.dispatchSpy();
            const token = "TOKEN";
            this.getStore().logIn(token, true);
            const expectedPayload: LogInProperties = {
                token: "TOKEN",
                username: null,
                modellingGroups: [],
                permissions: [],
                isModeller: false,
                isAccountActive: false,
                triggeredByUser: true
            };
            expectOrderedActions(spy, [{ action: "AuthActions.logIn", payload: expectedPayload }], 0);
        });

        it("loadAccessToken does not trigger log in if token is null", () => {
            const spy = this.sandbox.dispatchSpy();
            this.sandbox.sinon.stub(tokenStorageHelper, "loadToken").returns(null);
            this.getStore().loadAccessToken();
            expectNoActions(spy);
        });

        it("loadAccessToken triggers log in if token is not null", () => {
            const spy = this.sandbox.dispatchSpy();
            this.sandbox.sinon.stub(tokenStorageHelper, "loadToken").returns("TOKEN");
            this.getStore().loadAccessToken();
            expectOneAction(spy, { action: "AuthActions.logIn" });
        });
    }
}

describe("tokenStorageHelper.loadToken", () => {
    it("returns null if token is not in store", () => {
        withMockLocalStorage({}, () => {
            expect(tokenStorageHelper.loadToken()).to.be.null;
        });
    });

    it("returns null if token in store is corrupted", () => {
        withMockLocalStorage({ "accessToken": "BAD" }, () => {
            expect(tokenStorageHelper.loadToken()).to.be.null;
        });
    });

    it("returns null and removes token from store if token in store is soon to expire", () => {
        const nowInSeconds = new Date().getTime() / 1000;
        withMockLocalStorage({
            "accessToken": jwt.sign({
                exp: nowInSeconds + (4 * 60) // Four minutes in the future
            }, 'secret')
        }, () => {
            expect(tokenStorageHelper.loadToken()).to.be.null;
            expect(localStorage.getItem("accessToken")).to.be.undefined;
        });
    });

    it("returns token if token in store is valid", () => {
        const nowInSeconds = new Date().getTime() / 1000;
        const token = jwt.sign({
            exp: nowInSeconds + (6 * 60) // One hour in the future
        }, 'secret');
        withMockLocalStorage({ "accessToken": token }, () => {
            expect(tokenStorageHelper.loadToken()).to.equal(token);
        });
    });
});