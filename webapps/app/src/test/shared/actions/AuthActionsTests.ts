import { expect } from "chai";
const configureReduxMockStore  = require('redux-mock-store');
import * as jwt from "jsonwebtoken";

import { Sandbox } from "../../Sandbox";
import { authActions } from "../../../main/shared/actions/authActions";
import { AuthService } from "../../../main/shared/services/AuthService";
import { mainStore as contribMainStore } from "../../../main/contrib/stores/MainStore";
import { AuthTypeKeys } from "../../../main/shared/actionTypes/AuthTypes";

import thunk from 'redux-thunk';
import {localStorageHandler} from "../../../main/shared/services/localStorageHandler";

describe("Modelling groups actions tests", () => {
    const sandbox = new Sandbox();
    const middlewares: any = [thunk]
    const initialState = {}
    const mockStore = configureReduxMockStore(middlewares);
    let store: any = null;

    const mockUsertokenData = {
        sub: "test.user",
        permissions: "*/can-login,*/countries.read,*/demographics.read,*…les.write,modelling-group:test-group/users.create", roles: "*/user,modelling-group:IC-Garske/member,*/user-man…/uploader,modelling-group:test-group/user-manager",
        iss: "vaccineimpact.org",
        exp: Math.round(Date.now() / 1000) + 1000
    };

    const mockUsertokenDataNotActive = Object.assign({}, mockUsertokenData, {
        permissions: "*/countries.read,*/demographics.read,*…les.write,modelling-group:test-group/users.create", roles: "*/user,modelling-group:IC-Garske/member,*/user-man…/uploader,modelling-group:test-group/user-manager"
    });

    beforeEach(() => {
        store = mockStore(initialState);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("dispatches authenticated action if service returned proper token", (done) => {
        const testToken = jwt.sign(mockUsertokenData, "secret");
        sandbox.setStubFunc(AuthService.prototype, "logIn", ()=>{
            return Promise.resolve({access_token: testToken});
        });
        sandbox.setStub(AuthService.prototype, "authToShiny");
        sandbox.setStub(contribMainStore, "load");
        store.dispatch(authActions.logIn('test', 'test'))
        setTimeout(() => {
            const actions = store.getActions()
            expect(actions[0].type).to.eql(AuthTypeKeys.AUTHENTICATED)
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
            const actions = store.getActions()
            expect(actions[0].type).to.eql(AuthTypeKeys.AUTHENTICATION_ERROR)
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
            const actions = store.getActions()
            expect(actions[0].type).to.eql(AuthTypeKeys.AUTHENTICATION_ERROR)
            done();
        });
    });

    it("dispatches authenticated action if saved token can be loaded and not expired", (done) => {
        const testToken = jwt.sign(mockUsertokenData, "secret");
        sandbox.setStubFunc(localStorageHandler, "get", ()=> testToken);
        sandbox.setStub(contribMainStore, "load");
        sandbox.setStub(AuthService.prototype, "authToShiny");
        store.dispatch(authActions.loadSavedToken())
        setTimeout(() => {
            const actions = store.getActions()
            expect(actions[0].type).to.eql(AuthTypeKeys.AUTHENTICATED)
            done();
        });
    });

    it("dispatches unauthenticated action if saved token can be loaded and expired", (done) => {
        const mockUserTokenDataExpired = Object.assign(mockUsertokenData, {exp: Math.round(Date.now() / 1000)});
        const testToken = jwt.sign(mockUserTokenDataExpired, "secret");
        sandbox.setStubFunc(localStorageHandler, "get", ()=> testToken);
        sandbox.setStub(AuthService.prototype, "unauthFromShiny");
        store.dispatch(authActions.loadSavedToken())
        setTimeout(() => {
            const actions = store.getActions()
            expect(actions[0].type).to.eql(AuthTypeKeys.UNAUTHENTICATED)
            done();
        });
    });

});
