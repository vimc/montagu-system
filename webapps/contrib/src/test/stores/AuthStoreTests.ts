import { expect } from 'chai';
import { Sandbox } from "../Sandbox";
import { alt } from "../../main/alt";
import { authActions, LogInProperties } from "../../main/actions/AuthActions";
const jwt = require("jsonwebtoken");

import * as AuthStore from '../../main/stores/AuthStore';
import * as MainStore from '../../main/stores/MainStore';
import { dispatchSpy, expectOrderedActions } from "../actionHelpers";

describe("AuthStore", () => {
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

        const expected: AuthStore.State = {
            loggedIn: true,
            modellingGroups: [ "test.group" ],
            permissions: [ "*/can-login", "*/other" ],
            username: "test.user",
            bearerToken: token
        };
        expect(AuthStore.Store.getState()).to.eql(expected);
    });

    it("clears everything on logOut", () => {
        alt.bootstrap(JSON.stringify({
            AuthStore: {
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
        expect(AuthStore.Store.getState()).to.eql(AuthStore.initialState());
        expect(MainStore.Store.getState()).to.eql(MainStore.initialState());
    });

    it("logIn invokes logIn action", () => {
        const spy = dispatchSpy(sandbox);
        const storeLoad = sandbox.sinon.stub(MainStore.Store, "load");
        const token = "TOKEN";
        AuthStore.Store.logIn(token);
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
        const spy = dispatchSpy(sandbox);
        const storeLoad = sandbox.sinon.stub(MainStore.Store, "load");
        const token = jwt.sign({
            sub: "test.user",
            permissions: "*/can-login,*/other",
            roles: "r1,modelling-group:test.group/member"
        }, 'secret');
        AuthStore.Store.logIn(token);
        expectOrderedActions(spy, [{ action: "AuthActions.logIn" }], 0);
        expect(storeLoad.called).to.be.true;
        storeLoad.restore();
    });
});
