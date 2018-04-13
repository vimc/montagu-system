import { expect } from "chai";
import * as jwt from "jsonwebtoken";

import { Sandbox } from "../../Sandbox";
import { authActions } from "../../../main/shared/actions/authActions";
import { AuthService } from "../../../main/shared/services/AuthService";
// import { mainStore as contribMainStore } from "../../../main/contrib/stores/MainStore";
import { AuthTypeKeys } from "../../../main/shared/actionTypes/AuthTypes";
import { createMockStore } from "../../mocks/mockStore";
import { NotificationState, notificationStore } from "../../../main/shared/stores/NotificationStore";

import {localStorageHandler} from "../../../main/shared/services/localStorageHandler";

describe("Modelling groups actions tests", () => {
    const sandbox = new Sandbox();
    let store: any = null;

    const mockUsertokenData = {
        sub: "test.user",
        permissions: "*/can-login,*/countries.read,*/demographics.read,*…les.write,modelling-group:test-group/users.create",
        roles: "*/user,modelling-group:IC-Garske/member,*/user-man…/uploader,modelling-group:test-group/user-manager",
        iss: "vaccineimpact.org",
        exp: Math.round(Date.now() / 1000) + 1000
    };

    const mockUsertokenDataNotActive = Object.assign({}, mockUsertokenData, {
        permissions: "*/countries.read,*/demographics.read,*…les.write,modelling-group:test-group/users.create"
    });

    const mockUsertokenNotModeller = Object.assign({}, mockUsertokenData, {
        roles: ""
    });

    beforeEach(() => {
        store = createMockStore();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("dispatches authenticated action if service returned proper token", (done) => {
        const testToken = jwt.sign(mockUsertokenData, "secret");
        sandbox.setStubFunc(AuthService.prototype, "logIn", ()=>{
            return Promise.resolve({access_token: testToken});
        });
        sandbox.setStub(AuthService.prototype, "setShinyCookie");
        // sandbox.setStub(contribMainStore, "load");
        store.dispatch(authActions.logIn('test', 'test'))
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(AuthTypeKeys.AUTHENTICATED);
            done();
        });
    });

    it("dispatches authentication error action if service returned error", (done) => {
        const testToken = jwt.sign(mockUsertokenData, "secret");
        sandbox.setStubFunc(AuthService.prototype, "logIn", ()=>{
            return Promise.resolve({error: 'test error'});
        });
        store.dispatch(authActions.logIn('test', 'test'))
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(AuthTypeKeys.AUTHENTICATION_ERROR);
            done();
        });
    });

    it("dispatches authentication error action if user is not active", (done) => {
        const testToken = jwt.sign(mockUsertokenDataNotActive, "secret");
        sandbox.setStubFunc(AuthService.prototype, "logIn", ()=>{
            return Promise.resolve({access_token: testToken});
        });
        store.dispatch(authActions.logIn('test', 'test'))
        setTimeout(() => {
            const actions = store.getActions();
            const state = notificationStore.getState();
            expect(state.errors[0].search('Your account has been deactivated.')).is.equal(0);
            expect(actions[0].type).to.eql(AuthTypeKeys.AUTHENTICATION_ERROR);
            done();
        });
    });

    it("dispatches authentication error action if user is not modeller", (done) => {
        const testToken = jwt.sign(mockUsertokenNotModeller, "secret");
        sandbox.setStubFunc(AuthService.prototype, "logIn", ()=>{
            return Promise.resolve({access_token: testToken});
        });
        store.dispatch(authActions.logIn('test', 'test'))
        setTimeout(() => {
            const actions = store.getActions();
            const state = notificationStore.getState();
            expect(state.errors[0].search('Only members of modelling groups can log into the contribution portal')).is.equal(0);
            expect(actions[0].type).to.eql(AuthTypeKeys.AUTHENTICATION_ERROR);
            done();
        });
    });

    it("dispatches authenticated action if saved token can be loaded and not expired", (done) => {
        const testToken = jwt.sign(mockUsertokenData, "secret");
        sandbox.setStubFunc(localStorageHandler, "get", ()=> testToken);
        // sandbox.setStub(contribMainStore, "load");
        sandbox.setStub(AuthService.prototype, "setShinyCookie");
        store.dispatch(authActions.loadSavedToken())
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(AuthTypeKeys.AUTHENTICATED);
            done();
        });
    });

    it("dispatches unauthenticated action if saved token can be loaded and expired", (done) => {
        const mockUserTokenDataExpired = Object.assign(mockUsertokenData, {exp: Math.round(Date.now() / 1000)});
        const testToken = jwt.sign(mockUserTokenDataExpired, "secret");
        sandbox.setStubFunc(localStorageHandler, "get", ()=> testToken);
        sandbox.setStub(AuthService.prototype, "clearShinyCookie");
        store.dispatch(authActions.loadSavedToken())
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(AuthTypeKeys.UNAUTHENTICATED);
            done();
        });
    });

});
