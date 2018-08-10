import {expect} from "chai";
import * as jwt from "jsonwebtoken";
import {Sandbox} from "../../Sandbox";
import {authActionCreators} from "../../../main/shared/actions/authActionCreators";
import {AuthService} from "../../../main/shared/services/AuthService";
import {AuthTypeKeys} from "../../../main/shared/actionTypes/AuthTypes";
import {createMockStore} from "../../mocks/mockStore";

import {localStorageHandler} from "../../../main/shared/services/localStorageHandler";
import {signAndCompress} from "../helpers/TokenHelpers";
import {NotificationTypeKeys} from "../../../main/shared/actionTypes/NotificationTypes";

describe("AuthActions", () => {
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
        const testToken = signAndCompress(mockUsertokenData);
        sandbox.setStubFunc(AuthService.prototype, "logIn", () => {
            return Promise.resolve({access_token: testToken});
        });
        sandbox.setStub(AuthService.prototype, "setShinyCookie");
        store.dispatch(authActionCreators.logIn('test', 'test'));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(AuthTypeKeys.AUTHENTICATED);
            done();
        });
    });

    it("dispatches authentication error action if service returned error", (done) => {
        sandbox.setStubFunc(AuthService.prototype, "logIn", () => {
            return Promise.resolve({error: 'test error'});
        });
        store.dispatch(authActionCreators.logIn('test', 'test'));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(AuthTypeKeys.AUTHENTICATION_ERROR);
            done();
        });
    });

    it("dispatches authentication error action if user is not active", (done) => {
        const testToken = signAndCompress(mockUsertokenDataNotActive);
        sandbox.setStubFunc(AuthService.prototype, "logIn", () => {
            return Promise.resolve({access_token: testToken});
        });
        store.dispatch(authActionCreators.logIn('test', 'test'));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(NotificationTypeKeys.NOTIFY);
            expect(actions[0].message).to.contain("Your account has been deactivated.");
            expect(actions[1].type).to.eql(AuthTypeKeys.AUTHENTICATION_ERROR);
            done();
        });
    });

    it("dispatches authentication error action if user is not modeller", (done) => {
        const testToken = signAndCompress(mockUsertokenNotModeller);
        sandbox.setStubFunc(AuthService.prototype, "logIn", () => {
            return Promise.resolve({access_token: testToken});
        });
        store.dispatch(authActionCreators.logIn('test', 'test'));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(NotificationTypeKeys.NOTIFY);
            expect(actions[0].message).to.contain("Only members of modelling groups can log into the contribution portal");
            expect(actions[1].type).to.eql(AuthTypeKeys.AUTHENTICATION_ERROR);
            done();
        });
    });

    it("dispatches authenticated action if saved token can be loaded and not expired", (done) => {
        const testToken = signAndCompress(mockUsertokenData);
        sandbox.setStubFunc(localStorageHandler, "get", () => testToken);
        sandbox.setStub(AuthService.prototype, "setShinyCookie");
        store.dispatch(authActionCreators.loadSavedToken());
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(AuthTypeKeys.AUTHENTICATED);
            done();
        });
    });

    it("dispatches unauthenticated action if saved token can be loaded and expired", (done) => {
        const mockUserTokenDataExpired = Object.assign(mockUsertokenData, {exp: Math.round(Date.now() / 1000)});
        const testToken = signAndCompress(mockUserTokenDataExpired, "secret");
        sandbox.setStubFunc(localStorageHandler, "get", () => testToken);
        sandbox.setStub(AuthService.prototype, "clearShinyCookie");
        store.dispatch(authActionCreators.loadSavedToken());
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(AuthTypeKeys.UNAUTHENTICATED);
            done();
        });
    });

    it("dispatches unauthenticated action if saved token can't be inflated", (done) => {
        const testToken = jwt.sign(mockUsertokenData, "secret");
        sandbox.setStubFunc(localStorageHandler, "get", () => testToken);
        sandbox.setStub(AuthService.prototype, "clearShinyCookie");
        store.dispatch(authActionCreators.loadSavedToken());
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(AuthTypeKeys.UNAUTHENTICATED);
            done();
        });
    });
});
