import { expect } from "chai";
import { createStore } from "redux";

import { Sandbox } from "../../Sandbox";
import { AbstractLocalService } from "../../../main/shared/services/AbstractLocalService";
import { settings } from "../../../main/shared/Settings";
import { AuthTypeKeys } from "../../../main/shared/actionTypes/AuthTypes";
import { createMockStore } from "../../mocks/mockStore";
import {mockGlobalState} from "../../mocks/mockStates";

describe('Local service class initialization tests', () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('initializes default service with default option url', () => {
        const store = createStore(state => state, mockGlobalState({auth: {bearerToken: null}}));
        class TestService extends AbstractLocalService {
            test() {
                return {
                    options: this.options
                };
            }
        }
        sandbox.setStubFunc(settings, 'apiUrl', () => 'test-url')
        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(serviceData.options.baseURL).is.equal('test-url');
        expect(typeof serviceData.options.Authorization).to.equal('undefined')
    });

    it('initializes default service with request engine and token', () => {
        const store = createStore(state => state, mockGlobalState({auth: {bearerToken: "token"}}));

        class TestService extends AbstractLocalService {
            test() {
                return {
                    options: this.options,
                    requestOptions: this.makeRequestOptions('POST')
                };
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(serviceData.options.baseURL).is.not.empty;
        expect(serviceData.options.Authorization).is.equal("Bearer token");
        expect(serviceData.requestOptions.headers.Authorization).is.equal("Bearer token");
    });

    it('initializes default service with request engine, token and withCredentials option', () => {
        const store = createStore(state => state, mockGlobalState({auth: {bearerToken: "token"}}));

        class TestService extends AbstractLocalService {
            test() {
                this.setOptions({credentials: "include"})
                return {
                    requestOptions: this.makeRequestOptions('POST'),
                    options: this.options
                };
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(serviceData.options.baseURL).is.not.empty;
        expect(serviceData.options.Authorization).is.equal("Bearer token");
        expect(serviceData.requestOptions.credentials).is.equal("include");

    });

    it('initializes default service with request engine and basic authorization', () => {
        const store = createStore(state => state, mockGlobalState());
        const email = "abc@abc.com";
        const password = "abc";

        class TestService extends AbstractLocalService {
            test() {
                this.setOptions({Authorization: 'Basic ' + btoa(`${email}:${password}`)});
                return {
                    requestOptions: this.makeRequestOptions('POST'),
                    options: this.options
                };
            }
        }

        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(serviceData.options.baseURL).is.not.empty;
        expect(serviceData.options.Authorization).is.equal("Basic " + btoa(`${email}:${password}`));

    });
});

describe('Local service class requests tests', () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('performs successful query', async () => {
        const store = createStore(state => state, mockGlobalState());
        class TestService extends AbstractLocalService {
            test() {
                return this.get("/test/");
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        sandbox.setStubFunc(testService, "doFetch", ()=> Promise.resolve());
        sandbox.setStubFunc(testService, "processResponse", ()=> Promise.resolve("testData"));
        const serviceData = await testService.test();
        expect(serviceData).to.equal("testData");
    });

    it('performs query and api says token expired', async () => {
        const store = createMockStore();
        class TestService extends AbstractLocalService {
            test() {
                return this.get("/test/");
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        sandbox.setStubFunc(testService, "doFetch", ()=> Promise.resolve({
            json: (): any => {
                return Promise.resolve({
                    status: "failure",
                    errors: [{code: "bearer-token-invalid"}]
                })
            }
        }));
        try {
            await testService.test();
        } catch(e) {
            const actions = store.getActions()
            expect(actions[0].type).to.eql(AuthTypeKeys.UNAUTHENTICATED);
            expect(e.notification.message).to.eql('Your session has expired. You will need to log in again');
        }
    });
});

describe('Local service cache tests', () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('performs query without a cache', async () => {
        const store = createMockStore();
        let cacheEngine;
        class TestService extends AbstractLocalService {
            test() {
                cacheEngine = this.cacheEngine;
                return this.get("/test/");
            }
            getCacheEngine() {
                return this.cacheEngine;
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        const doFetchStub = sandbox.setStubFunc(testService, "doFetch", ()=> Promise.resolve({
            json: (): any => {
                return Promise.resolve({
                    status: "success",
                    data: "testData"
                })
            }
        }));
        const setCacheSpy = sandbox.setSpy(testService.getCacheEngine(), "set");
        const getCacheSpy = sandbox.setSpy(testService.getCacheEngine(), "get");
        const result = await testService.test();
        expect(doFetchStub.called).to.equal(true);
        expect(setCacheSpy.called).to.equal(false);
        expect(getCacheSpy.called).to.equal(false);
        expect(result).to.equal("testData");
    });

    it('performs query with the cache 2 times, first time from api, second from cache', async () => {
        const store = createMockStore();
        class TestService extends AbstractLocalService {
            test() {
                return this.setOptions({cache: "test"}).get("/test/");
            }
            getCacheEngine() {
                return this.cacheEngine;
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        const doFetchStub = sandbox.setStubFunc(testService, "doFetch", ()=> Promise.resolve({
            json: (): any => {
                return Promise.resolve({
                    status: "success",
                    data: "testData"
                })
            },
            url: settings.apiUrl() + "/test/"
        }));
        const setCacheSpy = sandbox.setSpy(testService.getCacheEngine(), "set");
        const getCacheSpy = sandbox.setSpy(testService.getCacheEngine(), "get");

        const resultFromApi = await testService.test();
        // first time it makes request and sets data to cache
        expect(doFetchStub.called).to.equal(true);
        expect(setCacheSpy.called).to.equal(true);
        expect(resultFromApi).to.equal("testData");

        doFetchStub.reset();
        // do second request
        const resultFromCache = await testService.test();
        // second time it doesn't make a request and fetches data from cache
        expect(doFetchStub.called).to.equal(false);
        expect(getCacheSpy.called).to.equal(true);
        expect(resultFromCache).to.equal("testData");
        expect(testService.getCacheEngine().get(["localService", "TestService", "test", encodeURIComponent(settings.apiUrl() + "/test/")].join("."))).to.equal("testData");
        testService.getCacheEngine().clearAll();
    });
});