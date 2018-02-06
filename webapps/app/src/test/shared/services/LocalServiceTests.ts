import { expect } from "chai";
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from 'redux-thunk';

import { Sandbox } from "../../Sandbox";

import { authReducer } from "../../../main/shared/reducers/authReducer";
import { LocalService } from "../../../main/shared/services/LocalService";

describe('Local service class initialization tests', () => {
    it('initializes default service with request engine and default option url', () => {
        const store = createStore(state => state, {});

        class TestService extends LocalService {
            test() {
                return {
                    requestEngine: this.initRequestEngine(),
                    options: this.options
                };
            }
        }

        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(serviceData.options.baseURL).is.not.empty;
        expect(serviceData.requestEngine).is.not.empty;
        expect(serviceData.requestEngine.request).is.not.empty;

    });

    it('initializes default service with request engine and token', () => {
        const store = createStore(state => state, {auth: {bearerToken: "token"}});

        class TestService extends LocalService {
            test() {
                return {
                    requestEngine: this.initRequestEngine(),
                    options: this.options
                };
            }
        }

        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(serviceData.options.baseURL).is.not.empty;
        expect(serviceData.options.Authorization).is.equal("Bearer token");
        expect(serviceData.requestEngine).is.not.empty;
        expect(serviceData.requestEngine.request).is.not.empty;
    });

    it('initializes default service with request engine, token and withCredentials option', () => {
        const store = createStore(state => state, {auth: {bearerToken: "token"}});

        class TestService extends LocalService {
            test() {
                this.setOptions({withCredentials: true})
                return {
                    requestEngine: this.initRequestEngine(),
                    options: this.options
                };
            }
        }

        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(serviceData.options.baseURL).is.not.empty;
        expect(serviceData.options.Authorization).is.equal("Bearer token");
        expect(serviceData.options.withCredentials).is.equal(true);
        expect(serviceData.requestEngine).is.not.empty;
        expect(serviceData.requestEngine.request).is.not.empty;
    });

    it('initializes default service with request engine and basic authorization', () => {
        const store = createStore(state => state, {});
        const email = "abc@abc.com";
        const password = "abc";

        class TestService extends LocalService {
            test() {
                this.setOptions({Authorization: 'Basic ' + btoa(`${email}:${password}`)});
                return {
                    requestEngine: this.initRequestEngine(),
                    options: this.options
                };
            }
        }

        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(serviceData.options.baseURL).is.not.empty;
        expect(serviceData.options.Authorization).is.equal("Basic " + btoa(`${email}:${password}`));
        expect(serviceData.requestEngine).is.not.empty;
        expect(serviceData.requestEngine.request).is.not.empty;
    });
});

describe('Local service class requests tests', () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('performs successful query that triggers processSuccess', async () => {
        const store = createStore(state => state, {});
        class TestService extends LocalService {
            test() {
                return this.get("/test/");
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        sandbox.setStubFunc(testService, "initRequestEngine", ()=> {
            return {
                get() {
                    return Promise.resolve({
                        data: {
                            status: "success",
                            data: "testData"
                        }
                    })
                }
            }
        });
        const serviceData = await testService.test();
        expect(serviceData).to.equal("testData");
    });

    it('performs query that comes with error http status, triggers processFailure', async () => {
        const store = createStore(state => state, {});
        class TestService extends LocalService {
            test() {
                return this.get("/test/");
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        sandbox.setStubFunc(testService, "initRequestEngine", ()=> {
            return {
                get() {
                    return Promise.reject({
                        response: {
                            data: {
                                errors: [{code: "error", message: "Error"}],
                            }
                        }
                    })
                }
            }
        });
        try {
            const serviceData = await testService.test();
        } catch(e) {
            expect(e.notification.type).to.equal("error");
            expect(e.notification.message).to.equal("Error");
        }
    });

    it('performs query that comes with expired token result, triggers log out', async () => {
        const store = createStore(combineReducers({auth: authReducer}), applyMiddleware(thunk));
        class TestService extends LocalService {
            test() {
                return this.get("/test/");
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        const logoutStub = sandbox.setStubFunc(testService, "logOut",()=>({type: "test"}));
        sandbox.setStubFunc(testService, "initRequestEngine", ()=> {
            return {
                get() {
                    return Promise.reject({
                        response: {
                            data: {
                                errors: [{code: "bearer-token-invalid", message: "Error"}],
                            }
                        }
                    })
                }
            }
        });
        try {
            await testService.test();
        } catch(e) {
            expect(e.notification.type).to.equal("info");
            expect(e.notification.message).to.equal("Your session has expired. You will need to log in again");
            expect(logoutStub.called).to.equal(true);
        }
    });

});
